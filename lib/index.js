// @dsh-local/account-meter — host half.
// Fork of dsh-usage-dashboard-plus with multi-account support:
//   - per-account balance via each provider's own balance endpoint
//     (DeepSeek GET /user/balance, Kimi GET /v1/users/me/balance),
//     resolved through the DSH credentials service, cached per account
//   - per-account today's spend estimated from DSH session logs
//     (token usage × price table), attributed by model prefix
//   - "active" account = the provider/model currently selected in the
//     agent default model selection
// The client half renders a right-edge floating card polling this route.
// Also registers the `usageDashboard` session projection unit (per-call logs
// and per-model stats, read by the Settings dashboard tab) — merged from
// dsh-stats-dashboard.
import z from "@deepseek-ai/schemastery";
import { z as zodZ } from "zod";
import { isTokenDelta } from "@deepseek-ai/dsh-llm/message";
import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { zstdDecompressSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const name = "account-meter";
const inject = ["webServer", "sessionProjections"];

/**
* Official DeepSeek prices in CNY per 1M tokens (cache hit / cache miss /
* output), effective before the 2026-08-17 adjustment. Source:
* https://api-docs.deepseek.com/zh-cn/quick_start/pricing/
*/
const DEFAULT_PRICES = {
  "deepseek-v4-flash": { input: 1, cacheRead: 0.02, output: 2 },
  "deepseek-v4-pro": { input: 3, cacheRead: 0.025, output: 6 },
  // 外部视觉模型（vision-fallback 默认）：按 opencode zen GO 估算，
  // 可在看板配置 prices 里覆盖。
  "mimo-v2.5": { input: 2, cacheRead: 0.05, output: 8 }
};
/**
* Date-gated pricing (peak/off-peak). From 2026-08-17 00:00 (Beijing time)
* DeepSeek moves to peak/off-peak rates: peak 9:00-12:00 and 14:00-18:00,
* off-peak is half the peak price. `from` is the local (Beijing) date from
* which the entry applies; the latest matching entry wins.
*/
const DEFAULT_PRICE_SCHEDULE = [
  {
    from: "2026-08-17",
    peak: {
      "deepseek-v4-flash": { input: 3, cacheRead: 0.1, output: 9 },
      "deepseek-v4-pro": { input: 9, cacheRead: 0.3, output: 27 }
    },
    idle: {
      "deepseek-v4-flash": { input: 1.5, cacheRead: 0.05, output: 4.5 },
      "deepseek-v4-pro": { input: 4.5, cacheRead: 0.15, output: 13.5 }
    }
  }
];
/** Fallback pricing for models absent from every table. */
const FALLBACK_PRICE = { input: 1, cacheRead: 0.02, output: 2 };

const PRICE_ENTRY = z.object({
  input: z.number().min(0),
  cacheRead: z.number().min(0),
  output: z.number().min(0)
});

/**
* 账户定义。每个账户对应一个服务商：
*  - id: 稳定标识（client 用它做 key）
*  - name: 展示名
*  - keyRef: credentials 里解析的 API key 引用名
*  - baseURL: 余额接口基址
*  - balancePath: 余额接口路径
*  - modelPrefixes: 会话日志中归属该账户的模型名前缀（消费拆分依据）
*  - providerKeys: agent 默认模型选择中的 provider 标识（当前接入判断）
*  - logo / color: client 展示用
*/
const DEFAULT_ACCOUNTS = [
  {
    id: "deepseek",
    name: "DeepSeek",
    keyRef: "DEEPSEEK_API_KEY",
    baseURL: "https://api.deepseek.com",
    balancePath: "/user/balance",
    modelPrefixes: ["deepseek-"],
    providerKeys: ["deepseek", "deepseek-official"],
    logo: "深",
    color: "#4d7cfe"
  },
  {
    id: "kimi",
    name: "Kimi",
    keyRef: "KIMI_CODING_API_KEY",
    baseURL: "https://api.moonshot.cn",
    balancePath: "/v1/users/me/balance",
    modelPrefixes: ["moonshot-", "kimi-"],
    providerKeys: ["moonshot", "kimi"],
    logo: "K",
    color: "#2fae78"
  }
];

const ACCOUNT_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  keyRef: z.string(),
  baseURL: z.string(),
  balancePath: z.string(),
  modelPrefixes: z.array(z.string()),
  providerKeys: z.array(z.string()),
  logo: z.string(),
  color: z.string()
});

/**
* settings 命名空间 schema（~/.dsh/settings.yaml 的 account-meter 段）：
*  - accounts: 覆盖/扩展账户列表。留空（默认）使用内置 DEFAULT_ACCOUNTS。
*  - prices / priceSchedule: 计价覆盖（沿用原配置项，便于在 settings 里调整）。
* 留空 accounts 时自动回退到内置 DeepSeek + Kimi。
*/
const SettingsSchema = z.object({
  accounts: z.array(ACCOUNT_SCHEMA).default([]),
  prices: z.dict(PRICE_ENTRY).default({}),
  priceSchedule: z.array(z.object({
    from: z.string(),
    peak: z.dict(PRICE_ENTRY),
    idle: z.dict(PRICE_ENTRY)
  })).default([])
});
const SETTINGS_NS = "account-meter";

const Config = z.object({
  /**
  * 账户列表。留空使用内置默认（DeepSeek + Kimi）。
  * 想要只显示一个账户，就只留对应条目。
  */
  accounts: z.array(ACCOUNT_SCHEMA).default([]),
  /** Per-model CNY pricing overrides (per 1M tokens), merged over the defaults. */
  prices: z.dict(PRICE_ENTRY).default({}),
  /**
  * Date-gated peak/off-peak price tables, applied per event by its local
  * (Asia/Shanghai) date and hour. Entries: { from: "YYYY-MM-DD", peak: {...}, idle: {...} }.
  */
  priceSchedule: z.array(z.object({
    from: z.string(),
    peak: z.dict(PRICE_ENTRY),
    idle: z.dict(PRICE_ENTRY)
  })).default([]),
  /** Balance response cache TTL in ms. */
  balanceCacheMs: z.natural().default(60000),
  /** Optional explicit sessions-root override (default: <dsh home>/sessions). */
  sessionsRoot: z.string().default(""),
  /** Only scan session logs modified within this window (ms) for today's stats. */
  scanWindowMs: z.natural().default(48 * 3600 * 1000),
  /**
  * 外部调用用量日志（JSONL）：dsh-vision-fallback 等插件把不经 DSH 会话日志的
  * 模型调用（如视觉模型）用量写在这里，看板会一并计入统计。
  * 每行：{ "ts": <ms>, "model": "mimo-v2.5", "inputTokens": n, "outputTokens": n,
  *   "cacheReadTokens": n, "cacheWriteTokens": n }。
  * 留空使用默认 <dsh home>/vision-fallback/usage.jsonl；设为 "off" 关闭。
  */
  externalUsageLog: z.string().default("")
});

const ZSTD_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]); // 0xFD2FB528 LE

function zstdFrames(data) {
  const starts = [];
  let idx = data.indexOf(ZSTD_MAGIC);
  while (idx !== -1) {
    starts.push(idx);
    idx = data.indexOf(ZSTD_MAGIC, idx + 1);
  }
  return starts;
}

function decodeSessionLog(data) {
  const starts = zstdFrames(data);
  let text = "";
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1] : data.length;
    try {
      text += zstdDecompressSync(data.subarray(starts[i], end)).toString("utf8");
    } catch {
      // torn/incomplete final frame (live append) — skip
    }
  }
  return text;
}

function collectLogs(root, out = []) {
  let entries;
  try {
    entries = readdirSync(root);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(root, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) collectLogs(full, out);
    else if ((entry === "session.jsonl.zstd" || entry === "session.jsonl") && st.size > 0) out.push({ path: full, mtimeMs: st.mtimeMs });
  }
  return out;
}

function localDayKey(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyModelRec() {
  return { cost: 0, calls: 0, tokens: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } };
}

function emptyDayRec() {
  return { cost: 0, calls: 0, tokens: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, byModel: /* @__PURE__ */ new Map(), files: 0, events: 0 };
}

/** Hour of day (0-23) in the pricing timezone (Asia/Shanghai). */
function shanghaiHour(ms) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    hour: "numeric",
    hour12: false
  }).formatToParts(new Date(ms));
  const raw = parts.find((p) => p.type === "hour")?.value ?? "0";
  return Number(raw) % 24;
}

/** Whether `ms` falls in DeepSeek's peak window (Beijing 9-12 / 14-18). */
function isPeakHour(ms) {
  const h = shanghaiHour(ms);
  return (h >= 9 && h < 12) || (h >= 14 && h < 18);
}

/**
* Resolve the price table for one event: the latest schedule entry whose
* `from` (local date) is <= the event date, then peak/idle by the event's
* Beijing hour; fall back to the base `prices` table.
* @returns the price entry and a short regime label.
*/
function priceFor(model, timeMs, prices, schedule) {
  const key = localDayKey(timeMs);
  let entry = null;
  for (const candidate of schedule) {
    if (candidate.from <= key) entry = candidate;
  }
  if (entry !== null) {
    const peak = isPeakHour(timeMs);
    const table = peak ? entry.peak : entry.idle;
    return {
      price: table[model] ?? FALLBACK_PRICE,
      label: `${entry.from} 起 · ${peak ? "高峰" : "空闲"}`
    };
  }
  return { price: prices[model] ?? FALLBACK_PRICE, label: "现行价格" };
}

/** Label for the pricing regime in effect for a given local date. */
function pricingLabelFor(dateKey, schedule) {
  let entry = null;
  for (const candidate of schedule) {
    if (candidate.from <= dateKey) entry = candidate;
  }
  return entry === null ? "现行价格" : `${entry.from} 起峰谷定价`;
}

/** 按模型名把一次调用归到某个账户；找不到返回 null。 */
function accountForModel(model, accounts) {
  if (typeof model !== "string" || model === "") return null;
  for (const acc of accounts) {
    for (const prefix of acc.modelPrefixes) {
      if (model.startsWith(prefix)) return acc;
    }
  }
  return null;
}

/**
* 按账户统计消费：扫描 DSH 会话日志（+ 外部用量日志），
* 把每一条 assistant/message 的 usage 归到对应账户，再按价格表估算费用。
* 返回 { accounts: Map<accountId, dayRec>, today: 合并汇总 }。
*/
function computeUsageByAccount(sessionsRoot, prices, schedule, scanWindowMs, externalUsageLog, accounts) {
  const now = Date.now();
  const todayKey = localDayKey(now);
  const days = /* @__PURE__ */ new Map();
  const today = emptyDayRec();
  days.set(todayKey, today);
  const accDays = /* @__PURE__ */ new Map();
  for (const acc of accounts) accDays.set(acc.id, /* @__PURE__ */ new Map());
  /** 取账户某天的累加器（按天分组，避免跨天串账）。 */
  const accDayFor = (accId, time) => {
    const byDay = accDays.get(accId);
    if (byDay === void 0) return null;
    const key = localDayKey(time);
    let rec = byDay.get(key);
    if (rec === void 0) {
      rec = emptyDayRec();
      byDay.set(key, rec);
    }
    return rec;
  };
  const accumulate = (rec, accRec, model, u, time) => {
    rec.files += 1;
    rec.events += 1;
    rec.tokens.input += u.inputTokens ?? 0;
    rec.tokens.output += u.outputTokens ?? 0;
    rec.tokens.cacheRead += u.cacheReadTokens ?? 0;
    rec.tokens.cacheWrite += u.cacheWriteTokens ?? 0;
    rec.calls += 1;
    const { price: p } = priceFor(model, time, prices, schedule);
    // cacheWrite tokens are billed as ordinary (cache-miss) input.
    const cost = ((u.inputTokens ?? 0) + (u.cacheWriteTokens ?? 0)) / 1e6 * p.input
      + ((u.cacheReadTokens ?? 0) / 1e6) * p.cacheRead
      + ((u.outputTokens ?? 0) / 1e6) * p.output;
    rec.cost += cost;
    if (accRec !== null) {
      accRec.files += 1;
      accRec.events += 1;
      accRec.tokens.input += u.inputTokens ?? 0;
      accRec.tokens.output += u.outputTokens ?? 0;
      accRec.tokens.cacheRead += u.cacheReadTokens ?? 0;
      accRec.tokens.cacheWrite += u.cacheWriteTokens ?? 0;
      accRec.calls += 1;
      accRec.cost += cost;
      let m = accRec.byModel.get(model);
      if (m === void 0) {
        m = emptyModelRec();
        accRec.byModel.set(model, m);
      }
      m.cost += cost;
      m.calls += 1;
      m.tokens.input += u.inputTokens ?? 0;
      m.tokens.output += u.outputTokens ?? 0;
      m.tokens.cacheRead += u.cacheReadTokens ?? 0;
      m.tokens.cacheWrite += u.cacheWriteTokens ?? 0;
    }
    let m = rec.byModel.get(model);
    if (m === void 0) {
      m = emptyModelRec();
      rec.byModel.set(model, m);
    }
    m.cost += cost;
    m.calls += 1;
    m.tokens.input += u.inputTokens ?? 0;
    m.tokens.output += u.outputTokens ?? 0;
    m.tokens.cacheRead += u.cacheReadTokens ?? 0;
    m.tokens.cacheWrite += u.cacheWriteTokens ?? 0;
  };
  const dayFor = (time) => {
    const key = localDayKey(time);
    let rec = days.get(key);
    if (rec === void 0) {
      rec = emptyDayRec();
      days.set(key, rec);
    }
    return rec;
  };
  const logs = collectLogs(sessionsRoot);
  for (const { path, mtimeMs } of logs) {
    if (now - mtimeMs > scanWindowMs) continue;
    let data;
    try {
      data = readFileSync(path);
    } catch {
      continue;
    }
    let text;
    try {
      text = decodeSessionLog(data);
    } catch {
      continue;
    }
    let currentModel = "(unknown)";
    for (const line of text.split("\n")) {
      if (line === "") continue;
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        continue;
      }
      if (ev.type === "request/header" && ev.data?.header?.config?.model) {
        currentModel = ev.data.header.config.model;
        continue;
      }
      if (ev.type !== "assistant/message" || ev.data?.usage == null) continue;
      const time = typeof ev.time === "number" ? ev.time : now;
      const acc = accountForModel(currentModel, accounts);
      const accRec = acc !== null ? accDayFor(acc.id, time) : null;
      accumulate(dayFor(time), accRec, currentModel, ev.data.usage, time);
    }
  }
  // 外部调用用量日志（如 vision-fallback 的视觉模型调用）。
  // "off" 关闭；空字符串走默认路径 <dsh home>/vision-fallback/usage.jsonl。
  if (externalUsageLog !== "off") {
    let externalPath = externalUsageLog;
    try {
      if (externalPath === "") externalPath = join(resolveDshHome(), "vision-fallback", "usage.jsonl");
      const data = readFileSync(externalPath, "utf8");
      for (const line of data.split("\n")) {
        if (line === "") continue;
        let rec;
        try {
          rec = JSON.parse(line);
        } catch {
          continue;
        }
        if (typeof rec?.model !== "string" || rec.model === "") continue;
        const time = typeof rec.ts === "number" ? rec.ts : now;
        const acc = accountForModel(rec.model, accounts);
        const accRec = acc !== null ? accDayFor(acc.id, time) : null;
        accumulate(dayFor(time), accRec, rec.model, rec, time);
      }
    } catch {
      /* 日志不存在或不可读时忽略 */
    }
  }
  const serializeDay = (rec) => ({
    cost: Math.round(rec.cost * 10000) / 10000,
    calls: rec.calls,
    tokens: {
      input: rec.tokens.input,
      output: rec.tokens.output,
      cacheRead: rec.tokens.cacheRead,
      cacheWrite: rec.tokens.cacheWrite
    },
    byModel: [...rec.byModel.entries()].sort((a, b) => b[1].cost - a[1].cost).map(([model, m]) => ({
      model,
      cost: Math.round(m.cost * 10000) / 10000,
      calls: m.calls,
      tokens: {
        input: m.tokens.input,
        output: m.tokens.output,
        cacheRead: m.tokens.cacheRead,
        cacheWrite: m.tokens.cacheWrite
      }
    }))
  });
  const week = [...days.keys()].sort().slice(-7).map((key) => ({
    date: key,
    cost: Math.round(days.get(key).cost * 10000) / 10000,
    calls: days.get(key).calls
  }));
  const perAccount = {};
  for (const acc of accounts) {
    const byDay = accDays.get(acc.id);
    const todayRec = byDay?.get(todayKey);
    perAccount[acc.id] = serializeDay(todayRec ?? emptyDayRec());
  }
  return {
    today: serializeDay(today),
    perAccount,
    week,
    scannedLogs: logs.length,
    pricingLabel: pricingLabelFor(todayKey, schedule)
  };
}

/**
* 读取外部调用用量日志（vision-fallback 等写出的 JSONL），转成与
* usageDashboard 投影逐条调用日志同构的行，供设置页"统计看板"直接合并展示。
* 视觉调用走 opencode-go 渠道的计价条目；无计价条目的模型返回 null 费用。
* "off" 返回空数组；空路径使用默认 <dsh home>/vision-fallback/usage.jsonl。
*/
function readExternalCalls(externalUsageLog) {
  if (externalUsageLog === "off") return [];
  const path = externalUsageLog !== "" && externalUsageLog !== undefined
    ? externalUsageLog
    : join(resolveDshHome(), "vision-fallback", "usage.jsonl");
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return [];
  }
  const rows = [];
  for (const line of text.split("\n")) {
    if (line === "") continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch {
      continue;
    }
    if (typeof rec?.model !== "string" || rec.model === "") continue;
    const usage = {
      inputTokens: rec.inputTokens ?? 0,
      outputTokens: rec.outputTokens ?? 0,
      cacheReadTokens: rec.cacheReadTokens ?? 0,
      cacheWriteTokens: rec.cacheWriteTokens ?? 0
    };
    rows.push({
      time: typeof rec.ts === "number" ? rec.ts : 0,
      provider: "opencode-go",
      model: rec.model,
      llmMs: 0,
      ttftMs: null,
      decodeMs: null,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      cacheReadTokens: usage.cacheReadTokens,
      cacheWriteTokens: usage.cacheWriteTokens,
      reasoningTokens: 0,
      estCostCny: projectionCostOf(projectionPriceOf("opencode-go", rec.model), usage)
    });
  }
  return rows;
}

function apply(ctx, config) {
  // 注册 usageDashboard 会话投影（合并自 dsh-stats-dashboard）：设置页统计看板的数据源。
  ctx.effect(() => ctx.sessionProjections.register(usageDashboardProjectionDefinition),
    "account-meter: usageDashboard projection unit");
  // 注册 settings 命名空间：账户列表/计价可通过 ~/.dsh/settings.yaml 的
  // `account-meter` 段配置，热生效（每次请求重新解析）。
  // 注意：必须用 ctx.inject(["settings"], ...) 注入（cordis 标准依赖注入），
  // 不能 ctx.get("settings")——后者在 apply 顶层同步调用时服务尚未就绪。
  let settingsScope = null;
  let settingsRegisterError = null;
  let settingsServiceForRoute = null;
  ctx.inject(["settings"], (settingsCtx) => {
    const svc = settingsCtx.settings;
    settingsServiceForRoute = svc;
    try {
      settingsScope = svc.register(SETTINGS_NS, SettingsSchema, { base: {} });
    } catch (error) {
      settingsRegisterError = error instanceof Error ? error.message : String(error);
      settingsCtx.logger?.warn?.(`account-meter: settings register failed: ${settingsRegisterError}`);
    }
    settingsCtx.effect(() => () => {
      settingsScope = null;
      settingsServiceForRoute = null;
    }, "account-meter: settings scope dispose");
  });
  /** 解析当前生效的账户列表：settings 配置 > 内置默认。 */
  const resolveAccounts = () => {
    const fromSettings = settingsScope?.get?.()?.accounts;
    if (Array.isArray(fromSettings) && fromSettings.length > 0) return fromSettings;
    return DEFAULT_ACCOUNTS;
  };
  /** 解析当前生效的计价覆盖：settings > composition config。 */
  const resolvePricing = () => {
    const s = settingsScope?.get?.();
    const basePrices = { ...DEFAULT_PRICES, ...(config.prices ?? {}) };
    const baseSchedule = [...DEFAULT_PRICE_SCHEDULE, ...(config.priceSchedule ?? [])].sort((a, b) => a.from.localeCompare(b.from));
    if (s === void 0) return { prices: basePrices, schedule: baseSchedule };
    const prices = { ...basePrices, ...(s.prices ?? {}) };
    const schedule = [...baseSchedule, ...(s.priceSchedule ?? [])].sort((a, b) => a.from.localeCompare(b.from));
    return { prices, schedule };
  };
  const balanceCaches = new Map(); // accountId -> { at, value }
  let usageCache = { at: 0, value: null };
  const sessionsRoot = config.sessionsRoot !== ""
    ? config.sessionsRoot
    : join(resolveDshHome(), "sessions");

  const resolveApiKey = async (keyRef) => {
    const credentials = ctx.get("credentials");
    if (credentials !== void 0) {
      const hit = await credentials.resolve(credentialRef(keyRef));
      if (hit !== void 0 && typeof hit.value === "string" && hit.value.trim() !== "") return hit.value.trim();
    }
    const ambient = process.env[keyRef];
    if (ambient !== void 0 && ambient.trim() !== "") return ambient.trim();
    return void 0;
  };

  /**
  * 查询单个账户余额。DeepSeek 响应 { is_available, balance_infos:[{currency,total_balance,...}] }；
  * Kimi/Moonshot 响应 { code, data: { available_balance, voucher_balance, cash_balance } }。
  * 统一成 { available, currency, totalBalance, grantedBalance, toppedUpBalance, fetchedAt }。
  */
  const fetchBalanceFor = async (acc) => {
    const now = Date.now();
    let cache = balanceCaches.get(acc.id);
    if (cache !== void 0 && cache.value !== null && now - cache.at < config.balanceCacheMs) return cache.value;
    const key = await resolveApiKey(acc.keyRef);
    if (key === void 0) {
      const value = { available: false, error: `未配置 API Key（${acc.keyRef}）` };
      balanceCaches.set(acc.id, { at: now, value });
      return value;
    }
    try {
      const base = acc.baseURL.replace(/\/+$/, "");
      const res = await fetch(`${base}${acc.balancePath}`, {
        headers: { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 200);
        } catch { /* ignore */ }
        const value = { available: false, error: `balance API ${res.status}: ${detail}` };
        balanceCaches.set(acc.id, { at: now, value });
        return value;
      }
      const data = await res.json();
      let value;
      if (acc.id === "kimi" || Array.isArray(data?.balance_infos) === false) {
        // Kimi/Moonshot 格式：data.available_balance / voucher_balance / cash_balance
        const d = data?.data ?? data;
        const total = Number(d?.available_balance ?? d?.total_balance ?? NaN);
        const cash = Number(d?.cash_balance ?? d?.topped_up_balance ?? 0);
        const voucher = Number(d?.voucher_balance ?? d?.granted_balance ?? 0);
        value = {
          available: Number.isFinite(total),
          currency: "CNY",
          totalBalance: Number.isFinite(total) ? total : 0,
          grantedBalance: Number.isFinite(voucher) ? voucher : 0,
          toppedUpBalance: Number.isFinite(cash) ? cash : 0,
          fetchedAt: now
        };
      } else {
        // DeepSeek 格式：balance_infos[0]
        const info = data.balance_infos[0];
        value = {
          available: data?.is_available === true,
          currency: info?.currency ?? "CNY",
          totalBalance: Number(info?.total_balance),
          grantedBalance: Number(info?.granted_balance),
          toppedUpBalance: Number(info?.topped_up_balance),
          fetchedAt: now
        };
      }
      balanceCaches.set(acc.id, { at: now, value });
      return value;
    } catch (error) {
      const value = { available: false, error: error instanceof Error ? error.message : String(error) };
      balanceCaches.set(acc.id, { at: now, value });
      return value;
    }
  };

  /**
  * 当前接入的账户：读 agentDefaultModel.currentSelection() 的 provider/model，
  * 优先按 provider 匹配，再按模型名前缀兜底。
  */
  const activeAccountId = (accounts) => {
    const am = ctx.get("agentDefaultModel");
    let provider = "";
    let model = "";
    try {
      const sel = am?.currentSelection();
      provider = typeof sel?.provider === "string" ? sel.provider : "";
      model = typeof sel?.model === "string" ? sel.model : "";
    } catch { /* 服务不可用或未配置时忽略 */ }
    if (provider !== "") {
      for (const acc of accounts) {
        if (acc.providerKeys.some((k) => k === provider || provider.startsWith(k))) return acc.id;
      }
    }
    if (model !== "") {
      const byModel = accountForModel(model, accounts);
      if (byModel !== null) return byModel.id;
    }
    return null;
  };

  const todayUsage = (accounts, prices, schedule) => {
    const now = Date.now();
    if (usageCache.value !== null && now - usageCache.at < 2000) return usageCache.value;
    const value = computeUsageByAccount(sessionsRoot, prices, schedule, config.scanWindowMs, config.externalUsageLog ?? "", accounts);
    usageCache = { at: now, value };
    return value;
  };

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-usage",
    handler: async (req, res) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405);
        res.end();
        return;
      }
      let body;
      try {
        // 每次请求重新解析配置：settings.yaml 里改了账户列表/计价，下一次请求即生效
        const accounts = resolveAccounts();
        const { prices, schedule } = resolvePricing();
        const usage = todayUsage(accounts, prices, schedule);
        const [balances, activeId] = await Promise.all([
          Promise.all(accounts.map((acc) => fetchBalanceFor(acc))),
          Promise.resolve(activeAccountId(accounts))
        ]);
        const accountsView = accounts.map((acc, i) => ({
          id: acc.id,
          name: acc.name,
          logo: acc.logo,
          color: acc.color,
          balance: balances[i],
          today: usage.perAccount[acc.id] ?? null
        }));
        body = JSON.stringify({
          ok: true,
          estimated: true,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local",
          generatedAt: Date.now(),
          accounts: accountsView,
          activeAccountId: activeId,
          total: usage.today,
          week: usage.week,
          scannedLogs: usage.scannedLogs,
          pricingLabel: usage.pricingLabel,
          externalCalls: readExternalCalls(config.externalUsageLog ?? ""),
          prices: { ...prices, ...schedule.length > 0 ? { _schedule: schedule } : {} }
        });
      } catch (error) {
        body = JSON.stringify({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          generatedAt: Date.now()
        });
      }
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      });
      res.end(body);
    }
  }), "account-meter: /api/dsh-usage route");

  // 账户配置读写端点：GET 读取当前账户配置（含内置默认），POST 写入 settings。
  // client 表单通过此端点读写，不依赖 client 侧 settings 服务。
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-usage/config",
    handler: async (req, res) => {
      const writeJson = (code, obj) => {
        res.writeHead(code, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        });
        res.end(JSON.stringify(obj));
      };
      try {
        if (req.method === "GET" || req.method === "HEAD") {
          const s = settingsScope?.get?.();
          const configured = s?.accounts ?? [];
          writeJson(200, {
            ok: true,
            configured,
            defaults: DEFAULT_ACCOUNTS,
            writable: settingsServiceForRoute?.writable === true,
            settingsError: settingsRegisterError ?? null
          });
          return;
        }
        if (req.method === "POST") {
          let raw = "";
          for await (const chunk of req) raw += chunk;
          let payload;
          try {
            payload = JSON.parse(raw);
          } catch {
            writeJson(400, { ok: false, error: "invalid JSON body" });
            return;
          }
          const list = Array.isArray(payload.accounts) ? payload.accounts : null;
          if (list === null) {
            writeJson(400, { ok: false, error: "body.accounts must be an array" });
            return;
          }
          if (settingsServiceForRoute === void 0 || settingsScope === null) {
            writeJson(503, { ok: false, error: "settings service unavailable" });
            return;
          }
          // 用 schemastery 标准校验接口解析（schema 无 .parse，用 ~standard）
          const validation = SettingsSchema["~standard"].validate({ accounts: list });
          if (validation.issues) {
            writeJson(400, { ok: false, error: validation.issues[0]?.message ?? "invalid accounts" });
            return;
          }
          const next = validation.value;
          await settingsServiceForRoute.update(SETTINGS_NS, { accounts: next.accounts });
          writeJson(200, { ok: true, accounts: next.accounts });
          return;
        }
        writeJson(405, { ok: false, error: "method not allowed" });
      } catch (error) {
        writeJson(500, {
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }), "account-meter: /api/dsh-usage/config route");
}

// ────────────────────────────────────────────────────────────────────────────
// usageDashboard 会话投影（合并自 dsh-stats-dashboard v1.0.0）
// 在会话日志重放时折叠 per-provider/per-model 统计与逐条调用日志，
// 设置页"统计看板"标签页通过 session-projection 读取。
// ────────────────────────────────────────────────────────────────────────────

/** 投影计价表：CNY / 1M tokens，键为 `${provider}\u0000${model}`。 */
const PROJECTION_PRICING = {
  "deepseek-official\u0000deepseek-v4-flash": { inputUncachedCny: 1.0, cacheReadCny: 0.02, outputCny: 2.0 },
  "deepseek-official\u0000deepseek-v4-pro": { inputUncachedCny: 3.0, cacheReadCny: 0.025, outputCny: 6.0 },
  "deepseek-official\u0000deepseek-chat": { inputUncachedCny: 2.0, cacheReadCny: 0.5, outputCny: 8.0 },
  "deepseek-official\u0000deepseek-reasoner": { inputUncachedCny: 4.0, cacheReadCny: 1.0, outputCny: 16.0 },
  "opencode-go\u0000deepseek-v4-flash": { inputUncachedCny: 1.0, cacheReadCny: 0.02, outputCny: 2.0 },
  "opencode-go\u0000mimo-v2.5": { inputUncachedCny: 2.0, cacheReadCny: 0.05, outputCny: 8.0 }
};

/** 每会话调用日志条数上限（投影内）。 */
const MAX_LOGS = 500;

function projectionPriceOf(provider, model) {
  return PROJECTION_PRICING[`${provider}\u0000${model}`] ?? null;
}

/**
 * 估算一次调用的费用（CNY）。缓存写入按未命中输入价计费；
 * 无计价条目返回 null。
 */
function projectionCostOf(price, usage) {
  if (price === null || typeof usage !== "object" || usage === null) return null;
  const input = typeof usage.inputTokens === "number" && Number.isFinite(usage.inputTokens) && usage.inputTokens > 0 ? usage.inputTokens : 0;
  const output = typeof usage.outputTokens === "number" && Number.isFinite(usage.outputTokens) && usage.outputTokens > 0 ? usage.outputTokens : 0;
  const cacheRead = typeof usage.cacheReadTokens === "number" && Number.isFinite(usage.cacheReadTokens) && usage.cacheReadTokens > 0 ? usage.cacheReadTokens : 0;
  const cacheWrite = typeof usage.cacheWriteTokens === "number" && Number.isFinite(usage.cacheWriteTokens) && usage.cacheWriteTokens > 0 ? usage.cacheWriteTokens : 0;
  return (input * price.inputUncachedCny + cacheRead * price.cacheReadCny + (cacheWrite + output) * price.outputCny) / 1e6;
}

function projectionNumberField(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

function projectionUsageField(usage, key) {
  if (typeof usage !== "object" || usage === null) return 0;
  const value = usage[key];
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

/** 金额保留 4 位小数，让每调用不足一分钱的金额也能存活。 */
function projectionRound4(value) {
  return value === null ? null : Math.round(value * 1e4) / 1e4;
}

/** zod wire view of one provider/model aggregate. */
const projectionModelStatSchema = zodZ.object({
  provider: zodZ.string(),
  model: zodZ.string(),
  calls: zodZ.number().int().nonnegative(),
  llmMs: zodZ.number().nonnegative(),
  ttftMs: zodZ.number().nonnegative(),
  ttftSteps: zodZ.number().int().nonnegative(),
  decodeMs: zodZ.number().nonnegative(),
  decodeTokens: zodZ.number().nonnegative(),
  inputTokens: zodZ.number().nonnegative(),
  outputTokens: zodZ.number().nonnegative(),
  cacheReadTokens: zodZ.number().nonnegative(),
  cacheWriteTokens: zodZ.number().nonnegative(),
  reasoningTokens: zodZ.number().nonnegative(),
  estCostCny: zodZ.number().nullable()
}).strict();

/** zod wire view of one call-log row. */
const projectionCallLogSchema = zodZ.object({
  time: zodZ.number(),
  turn: zodZ.number(),
  step: zodZ.number(),
  provider: zodZ.string(),
  model: zodZ.string(),
  llmMs: zodZ.number(),
  ttftMs: zodZ.number().nullable(),
  decodeMs: zodZ.number().nullable(),
  outputTokens: zodZ.number(),
  inputTokens: zodZ.number(),
  cacheReadTokens: zodZ.number(),
  cacheWriteTokens: zodZ.number(),
  reasoningTokens: zodZ.number(),
  estCostCny: zodZ.number().nullable()
}).strict();

const projectionUsageSchema = zodZ.object({
  models: zodZ.array(projectionModelStatSchema),
  logs: zodZ.array(projectionCallLogSchema),
  truncatedLogs: zodZ.boolean()
}).strict();

/**
 * `usageDashboard` 会话投影单元：从会话事件流折叠统计。
 * 客户端（设置页统计看板）通过 session-projection 读取。
 */
const usageDashboardProjectionDefinition = {
  key: "usageDashboard",
  schema: projectionUsageSchema,
  init: () => ({
    current: null,
    openStep: null,
    models: {},
    logs: [],
    truncatedLogs: false
  }),
  apply: (state, event) => {
    switch (event.type) {
      case "request/header": {
        const config = event.data?.header?.config;
        if (typeof config !== "object" || config === null) return state;
        const provider = typeof config.provider === "string" ? config.provider : "unknown";
        const model = typeof config.model === "string" ? config.model : "unknown";
        return { ...state, current: { provider, model } };
      }
      case "request/context": {
        const data = event.data;
        if (typeof data !== "object" || data === null) return state;
        const provider = typeof data.provider === "string" ? data.provider : "unknown";
        const model = typeof data.model === "string" ? data.model : "unknown";
        return { ...state, current: { provider, model } };
      }
      case "step/start": {
        const current = state.current ?? { provider: "unknown", model: "unknown" };
        return {
          ...state,
          openStep: {
            provider: current.provider,
            model: current.model,
            turn: event.data.turn,
            step: event.data.step,
            startTime: event.time,
            firstTokenTime: null
          }
        };
      }
      case "assistant/chunk": {
        const open = state.openStep;
        if (open === null || open.turn !== event.data.turn || open.step !== event.data.step) return state;
        if (open.firstTokenTime !== null || !isTokenDelta(event.data.chunk)) return state;
        return {
          ...state,
          openStep: { ...open, firstTokenTime: event.time }
        };
      }
      case "assistant/message": {
        const open = state.openStep;
        if (open === null || open.turn !== event.data.turn || open.step !== event.data.step) return state;
        const usage = event.data.usage;
        const llmMs = Math.max(0, event.time - open.startTime);
        const ttftMs = open.firstTokenTime === null ? null : Math.max(0, open.firstTokenTime - open.startTime);
        const outputTokens = projectionUsageField(usage, "outputTokens");
        const decodeMs = open.firstTokenTime !== null && outputTokens > 0 ? Math.max(0, event.time - open.firstTokenTime) : null;

        const inputTokens = projectionUsageField(usage, "inputTokens");
        const cacheReadTokens = projectionUsageField(usage, "cacheReadTokens");
        const cacheWriteTokens = projectionUsageField(usage, "cacheWriteTokens");
        const reasoningTokens = projectionUsageField(usage, "reasoningTokens");

        const price = projectionPriceOf(open.provider, open.model);
        const cost = projectionCostOf(price, usage);
        const key = `${open.provider}\u0000${open.model}`;
        const stat = state.models[key] ?? {
          provider: open.provider,
          model: open.model,
          calls: 0,
          llmMs: 0,
          ttftMs: 0,
          ttftSteps: 0,
          decodeMs: 0,
          decodeTokens: 0,
          inputTokens: 0,
          outputTokens: 0,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          reasoningTokens: 0,
          estCostCny: 0
        };
        const nextStat = {
          ...stat,
          calls: stat.calls + 1,
          llmMs: stat.llmMs + llmMs,
          ttftMs: stat.ttftMs + (ttftMs ?? 0),
          ttftSteps: stat.ttftSteps + (ttftMs === null ? 0 : 1),
          decodeMs: stat.decodeMs + (decodeMs ?? 0),
          decodeTokens: stat.decodeTokens + (decodeMs === null ? 0 : outputTokens),
          inputTokens: stat.inputTokens + inputTokens,
          outputTokens: stat.outputTokens + outputTokens,
          cacheReadTokens: stat.cacheReadTokens + cacheReadTokens,
          cacheWriteTokens: stat.cacheWriteTokens + cacheWriteTokens,
          reasoningTokens: stat.reasoningTokens + reasoningTokens,
          estCostCny: stat.estCostCny + (cost ?? 0)
        };
        const log = {
          time: event.time,
          turn: event.data.turn,
          step: event.data.step,
          provider: open.provider,
          model: open.model,
          llmMs: Math.round(llmMs),
          ttftMs: ttftMs === null ? null : Math.round(ttftMs),
          decodeMs: decodeMs === null ? null : Math.round(decodeMs),
          outputTokens,
          inputTokens,
          cacheReadTokens,
          cacheWriteTokens,
          reasoningTokens,
          estCostCny: cost === null ? null : Math.round(cost * 1e6) / 1e6
        };
        let logs = state.logs;
        let truncatedLogs = state.truncatedLogs;
        if (logs.length >= MAX_LOGS) {
          logs = logs.slice(logs.length - MAX_LOGS + 1);
          truncatedLogs = true;
        }
        return {
          ...state,
          openStep: null,
          models: { ...state.models, [key]: nextStat },
          logs: [...logs, log],
          truncatedLogs
        };
      }
      case "step/end": return { ...state, openStep: null };
      default: return state;
    }
  },
  view: (state) => ({
    models: Object.values(state.models)
      .map((m) => ({ ...m, estCostCny: projectionRound4(m.estCostCny) }))
      .sort((a, b) => b.calls - a.calls || b.estCostCny - a.estCostCny),
    logs: [...state.logs].reverse(),
    truncatedLogs: state.truncatedLogs
  }),
  stateVersion: 1
};

export { Config, DEFAULT_PRICES, DEFAULT_PRICE_SCHEDULE, PROJECTION_PRICING, DEFAULT_ACCOUNTS, SETTINGS_NS, SettingsSchema, accountForModel, apply, computeUsageByAccount, decodeSessionLog, inject, name, usageDashboardProjectionDefinition };
