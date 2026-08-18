window.__ModuleLoader__.load({
	id: "dsh-account-meter",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		const { jsx, jsxs, Fragment } = react_jsx_runtime;
		//#region styles
				const css = ".ud-widget{display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:8px;cursor:pointer;color:var(--dsw-alias-label-secondary);user-select:none;min-width:0;max-width:100%;overflow:hidden}.ud-widget:hover{background:var(--dsw-alias-interactive-bg-hover)}.ud-main{display:flex;align-items:baseline;gap:3px;font-size:11px;line-height:1.4;white-space:nowrap;min-width:0;flex:0 1 auto;overflow:hidden}.ud-label{color:var(--dsw-alias-label-secondary);font-size:10px;flex:none;white-space:nowrap}.ud-value{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-size:11px;white-space:nowrap;overflow:hidden}.ud-value.ud-warn{color:var(--dsw-alias-state-warn-primary)}.ud-refresh{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border:none;border-radius:50%;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:none;padding:0;margin-left:2px}.ud-refresh:hover{background:var(--dsw-alias-interactive-bg-hover)}.ud-refresh.ud-spin svg{animation:ud-spin .8s linear infinite}@keyframes ud-spin{to{transform:rotate(360deg)}}.ud-collapsed{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:50%;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;padding:0;font-size:13px;font-weight:600;font-family:inherit}.ud-collapsed:hover{background:var(--dsw-alias-interactive-bg-hover)}.ud-card{position:fixed;z-index:1000;min-width:250px;max-width:330px;padding:12px 14px;border-radius:12px;background:var(--dsw-alias-bg-overlay,#222327);color:var(--dsw-alias-label-primary);box-shadow:0 8px 30px rgba(0,0,0,.35);font-size:12px;line-height:1.65}.ud-card h4{margin:0 0 6px;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);letter-spacing:.02em}.ud-row{display:flex;justify-content:space-between;gap:14px;align-items:baseline}.ud-row+.ud-row{margin-top:2px}.ud-muted{color:var(--dsw-alias-label-secondary)}.ud-note{margin-top:8px;padding-top:8px;border-top:1px solid var(--dsw-alias-border-l);color:var(--dsw-alias-label-secondary);font-size:11px}.ud-err{color:var(--dsw-alias-state-error-primary)}.ud-loading{opacity:.55}";
				const tagId = "dsh-account-meter/styles";
				if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
					const tag = document.createElement("style");
					tag.dataset.plugin = "dsh-account-meter";
					tag.dataset.pluginCss = tagId;
					tag.textContent = css;
					document.head.appendChild(tag);
				}
				
		// ── account-meter right-edge card styles ───────────────────────────
				const amCss = ".am-card{position:fixed;z-index:1000;min-width:280px;max-width:340px;background:var(--dsw-alias-bg-overlay,#222327);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;padding:12px 12px 10px;color:var(--dsw-alias-label-primary);box-shadow:0 8px 30px rgba(0,0,0,.4);font-size:12px;line-height:1.5;user-select:none}.am-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.am-title{font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary)}.am-state{padding:16px 0;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12px}.am-acc{display:flex;align-items:center;gap:9px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:7px 9px;margin-bottom:7px;position:relative;background:transparent}.am-acc.am-active{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 8%,transparent)}.am-logo{width:28px;height:28px;border-radius:8px;flex:none;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff}.am-mid{flex:1;min-width:0}.am-name{font-size:11.5px;font-weight:600;color:var(--dsw-alias-label-primary);display:flex;align-items:center;gap:5px}.am-badge{font-size:9px;color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 14%,transparent);border:1px solid var(--dsw-alias-state-business-primary);border-radius:10px;padding:0 5px;line-height:13px;white-space:nowrap}.am-usage{display:flex;align-items:center;gap:5px;margin-top:2px;font-size:10px;color:var(--dsw-alias-label-secondary);min-width:0}.am-dsh-tag{font-size:8.5px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-radius:4px;padding:0 4px;line-height:13px;white-space:nowrap;flex:none}.am-widget-tag{font-size:8px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-radius:4px;padding:0 4px;line-height:14px;white-space:nowrap;flex:none;align-self:center}.am-usage-txt{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.am-right{text-align:right;flex:none}.am-bal{font-size:13px;font-weight:700;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.am-bal.am-err{color:var(--dsw-alias-state-error-primary);font-size:11px;font-weight:500}.am-currency{font-size:8.5px;color:var(--dsw-alias-label-secondary);margin-top:1px}.am-foot{display:flex;align-items:center;justify-content:space-between;margin-top:9px;padding-top:9px;border-top:1px solid var(--dsw-alias-border-l1)}.am-total{font-size:11px;color:var(--dsw-alias-label-secondary)}.am-total b{color:var(--dsw-alias-label-primary);font-size:12.5px;font-weight:700;margin-left:4px;font-variant-numeric:tabular-nums}.am-updated{font-size:9px;color:var(--dsw-alias-label-secondary)}.am-form-root{width:100%;max-width:760px;display:flex;flex-direction:column;gap:12px;color:var(--dsw-alias-label-primary)}.am-form-heading{margin:0;font-size:15px;font-weight:600;line-height:24px}.am-form-hint{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:20px}.am-form-empty{border:1px dashed var(--dsw-alias-border-l2);border-radius:10px;padding:16px;font-size:12px;color:var(--dsw-alias-label-tertiary);text-align:center}.am-form-acc{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:10px}.am-form-acc-head{display:flex;align-items:center;justify-content:space-between}.am-form-acc-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}.am-form-del{font-size:11px;color:var(--dsw-alias-state-error-primary);background:transparent;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 45%,transparent);border-radius:6px;padding:3px 10px;cursor:pointer}.am-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.am-form-field{display:flex;flex-direction:column;gap:4px;min-width:0}.am-form-label{font-size:11px;color:var(--dsw-alias-label-secondary)}.am-form-input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;border-radius:7px;padding:6px 9px;font-size:12.5px;outline:none;min-width:0}.am-form-input:focus{border-color:var(--dsw-alias-state-business-primary)}.am-form-add{align-self:flex-start;font-size:12px;color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 8%,transparent);border:1px dashed var(--dsw-alias-state-business-primary);border-radius:8px;padding:7px 14px;cursor:pointer}.am-form-actions{display:flex;gap:8px}.am-form-btn{font-size:12.5px;padding:7px 16px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);cursor:pointer}.am-form-btn-primary{background:var(--dsw-alias-state-business-primary);color:#fff;border-color:transparent}.am-form-note{font-size:11px;color:var(--dsw-alias-label-tertiary);line-height:18px}.am-form-sep{height:1px;background:var(--dsw-alias-border-l2);margin:4px 0 2px}.am-form-err{font-size:12px;color:var(--dsw-alias-state-error-primary);padding:8px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 40%,transparent);border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 8%,transparent)}";
				const amTagId = "dsh-account-meter/card.css";
				if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(amTagId) + "]") === null) {
					const tag = document.createElement("style");
					tag.dataset.plugin = "dsh-account-meter";
					tag.dataset.pluginCss = amTagId;
					tag.textContent = amCss;
					document.head.appendChild(tag);
				}
				
		const cssDash = ".ud-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}.ud-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;line-height:20px;transition:background .12s,border-color .12s}.ud-btn:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-state-business-primary)}.ud-btn:active{transform:scale(.97)}.ud-btn svg,.ud-btn .ud-icon{width:14px;height:14px;flex:none}.ud-root{width:100%;max-width:920px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}.ud-root h2{margin:0;font-size:16px;font-weight:600;line-height:24px}.ud-root h3{margin:0;font-size:13px;font-weight:600;line-height:20px}.ud-mt{color:var(--dsw-alias-label-tertiary)}.ud-filters{align-items:center;gap:8px;display:flex;flex-wrap:wrap}.ud-search{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:32px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;outline:none;padding:0 10px;font-size:13px;min-width:180px}.ud-search:focus-visible{border-color:var(--dsw-alias-state-business-primary)}.ud-select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:32px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;outline:none;padding:0 8px;font-size:13px}.ud-date{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:32px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:0 8px;font-size:13px;width:130px}.ud-cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;display:grid}.ud-cards4{grid-template-columns:repeat(4,minmax(0,1fr))}.ud-stat{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;padding:10px 12px;flex-direction:column;gap:2px;display:flex}.ud-statLabel{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}.ud-statValue{font-size:16px;font-weight:600;line-height:22px;font-variant-numeric:tabular-nums;word-break:break-all}.ud-statValue.ud-strong{color:var(--dsw-alias-state-business-primary)}.ud-statValue.ud-good{color:var(--dsw-alias-state-success-primary)}.ud-providers{flex-direction:column;gap:8px;display:flex}.ud-chipRow{flex-wrap:wrap;gap:6px;display:flex}.ud-chip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:999px;align-items:center;gap:8px;padding:4px 12px;font-size:12px;line-height:18px;display:inline-flex;cursor:pointer;transition:background .1s}.ud-chip:hover{background:var(--dsw-alias-interactive-bg-hover)}.ud-chip b{color:var(--dsw-alias-label-primary)}.ud-chip[data-active=true]{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 12%,transparent)}.ud-tableWrap{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;overflow:auto;max-height:460px}.ud-table{width:100%;border-collapse:collapse;font-size:12px;line-height:18px;font-variant-numeric:tabular-nums}.ud-table th{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-tertiary);text-align:left;font-weight:500;white-space:nowrap;position:sticky;top:0;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l2);cursor:pointer;user-select:none}.ud-table th:hover{color:var(--dsw-alias-label-primary)}.ud-table td{padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l2);white-space:nowrap;vertical-align:top}.ud-table tr:last-child td{border-bottom:none}.ud-table tbody tr:hover td{background:var(--dsw-alias-interactive-bg-hover)}.ud-num{text-align:right}.ud-pill{background:var(--dsw-alias-bg-layer-1);border-radius:5px;padding:1px 6px;font-size:11px;line-height:16px;white-space:nowrap;display:inline-block}.ud-pillModel{color:var(--dsw-alias-label-secondary)}.ud-pillProv{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 10%,transparent);color:var(--dsw-alias-state-business-primary)}.ud-pillRate{background:var(--dsw-alias-bg-module-platform);font-weight:500}.ud-pillRate[data-high=true]{color:var(--dsw-alias-state-success-primary)}.ud-pillRate[data-high=false]{color:var(--dsw-alias-state-warn-primary)}.ud-empty{border:1px dashed var(--dsw-alias-border-l2);border-radius:10px;color:var(--dsw-alias-label-tertiary);justify-content:center;align-items:center;padding:32px 16px;font-size:13px;display:flex}.ud-trn{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.ud-nt{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.ud-footer{border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);padding-top:10px;font-size:12px;line-height:18px}.ud-sort{display:inline-block;margin-left:4px;font-size:10px;color:var(--dsw-alias-label-tertiary)}.ud-section{flex-direction:column;gap:6px;display:flex}.ud-row{align-items:center;gap:8px;display:flex}";
		const tagIdDash = "dsh-account-meter/dashboard.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagIdDash) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-account-meter";
			tag.dataset.pluginCss = tagIdDash;
			tag.textContent = cssDash;
			document.head.appendChild(tag);
		}
		//#region locales
				const NS = "account-meter";
				/** Simplified Chinese dictionary (key-set source of truth). */
				const zh = {
					"cardTitle": "我的账户",
					"settingsTitle": "账户计量",
					"current": "当前接入",
					"dshOnly": "DSH 消耗",
					"dshTag": "DSH",
					"updatedAt": "更新于",
					"total": "账户总余额",
					"today": "今日",
					"refresh": "刷新",
					"loading": "加载中…",
					"unavailable": "获取失败",
					"retry": "点击刷新",
					"balance": "余额",
					"tokens": "Token 用量",
					"noAccount": "暂无账户"
				};
				/** English dictionary, checked complete against the zh key set. */
				const en = {
					"cardTitle": "My Accounts",
					"settingsTitle": "Account Meter",
					"current": "Active",
					"dshOnly": "DSH usage",
					"dshTag": "DSH",
					"updatedAt": "Updated",
					"total": "Total balance",
					"today": "Today",
					"refresh": "Refresh",
					"loading": "Loading…",
					"unavailable": "Unavailable",
					"retry": "Click to refresh",
					"balance": "Balance",
					"tokens": "Tokens",
					"noAccount": "No accounts"
				};
				
		const NS_DASH = "usageDashboard";
		const zhDash = {
			"tab": "统计看板",
			"heading": "用量统计看板",
			"sub": "按供应商 / 模型汇总的响应速度、调用日志、Token 用量与费用估算（来自各会话的 usageDashboard 投影）",
			"search.placeholder": "搜索供应商、模型或会话…",
			"filter.provider": "全部供应商",
			"filter.model": "全部模型",
			"filter.session": "全部会话",
			"overview.calls": "总调用",
			"overview.cost": "估算费用",
			"overview.input": "输入",
			"overview.output": "输出",
			"overview.cacheRead": "缓存读",
			"overview.cacheWrite": "缓存写",
			"overview.cacheRate": "缓存命中率",
			"overview.unknownCost": "未知定价",
			"providers.title": "供应商",
			"models.title": "模型统计",
			"logs.title": "调用日志",
			"col.provider": "供应商",
			"col.model": "模型",
			"col.calls": "调用",
			"col.avgLlm": "平均耗时",
			"col.avgTtft": "平均首token",
			"col.avgTps": "平均 tok/s",
			"col.input": "输入",
			"col.output": "输出",
			"col.cacheRead": "缓存读",
			"col.cacheWrite": "缓存写",
			"col.cacheRate": "缓存率",
			"col.cost": "费用",
			"col.time": "时间",
			"col.session": "会话",
			"col.llm": "耗时",
			"col.ttft": "首token",
			"col.tps": "tok/s",
			"col.rate": "缓存率",
			"col.date": "日期",
			"empty": "暂无调用数据——开始一个会话并让模型回复后，这里会显示统计。",
			"truncated": "部分会话的日志超过 500 条，已截断；模型汇总为全量。",
			"cost.note": "费用按内置价目表估算（¥/百万 tokens）：deepseek-v4-flash 输入1元/缓存命中0.02元/输出2元；deepseek-v4-pro 输入3元/0.025元/6元。未收录的模型显示“”，可在插件源码 PRICING 表中补充。",
			"footer": "共 {sessions} 个会话 · {logs} 条调用记录 · 数据随会话日志实时更新",
			"date.start": "开始日期",
			"date.end": "结束日期"
		};;
		const enDash = {
			"tab": "Usage Dashboard",
			"heading": "Usage Dashboard",
			"sub": "Per-provider/per-model response speed, call log, token totals, and cost estimates (from the usageDashboard projection of each session)",
			"search.placeholder": "Search provider, model or session…",
			"filter.provider": "All providers",
			"filter.model": "All models",
			"filter.session": "All sessions",
			"overview.calls": "Total calls",
			"overview.cost": "Est. cost",
			"overview.input": "Input",
			"overview.output": "Output",
			"overview.cacheRead": "Cache read",
			"overview.cacheWrite": "Cache write",
			"overview.cacheRate": "Cache hit rate",
			"overview.unknownCost": "“Unknown pricing”",
			"providers.title": "Providers",
			"models.title": "Model stats",
			"logs.title": "Call log",
			"col.provider": "Provider",
			"col.model": "Model",
			"col.calls": "Calls",
			"col.avgLlm": "Avg time",
			"col.avgTtft": "Avg TTFT",
			"col.avgTps": "Avg tok/s",
			"col.input": "Input",
			"col.output": "Output",
			"col.cacheRead": "Cache R",
			"col.cacheWrite": "Cache W",
			"col.cacheRate": "Cache %",
			"col.cost": "Cost",
			"col.time": "Time",
			"col.session": "Session",
			"col.llm": "Time",
			"col.ttft": "TTFT",
			"col.tps": "tok/s",
			"col.rate": "Cache %",
			"col.date": "Date",
			"empty": "No calls yet — start a session and let the model reply to see statistics here.",
			"truncated": "Some sessions keep more than 500 log rows; they are truncated. Model aggregates are complete.",
			"cost.note": "Costs use the built-in price table (CNY per 1M tokens): deepseek-v4-flash input 1 / cache-hit 0.02 / output 2; deepseek-v4-pro input 3 / 0.025 / 6. Unknown models show “-”; extend PRICING in the plugin source to cover them.",
			"footer": "{sessions} sessions · {logs} calls · live-updating from session logs",
			"date.start": "Start date",
			"date.end": "End date"
		};;
		//#region helpers
				function fmt(n, digits) {
					return Number.isFinite(n) ? n.toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "—";
				}
				function fmtTokens(n) {
					if (!Number.isFinite(n)) return "—";
					if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
					if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
					return String(n);
				}
				/** Fetch /api/dsh-usage; auto-refresh every 60s. */
				function useUsage() {
					const [state, setState] = react.useState({ phase: "loading", data: null, error: null });
					const abortRef = react.useRef(null);
					const load = react.useCallback(async () => {
						abortRef.current?.abort();
						const ctrl = new AbortController();
						abortRef.current = ctrl;
						setState((prev) => ({ ...prev, phase: prev.data === null ? "loading" : "refreshing" }));
						try {
							const res = await fetch("/api/dsh-usage", { signal: ctrl.signal, cache: "no-store" });
							if (!res.ok) throw new Error("HTTP " + res.status);
							const json = await res.json();
							if (json === null || typeof json !== "object" || json.ok !== true) throw new Error(json && json.error ? json.error : "bad response");
							setState({ phase: "ready", data: json, error: null });
						} catch (error) {
							if (error && error.name === "AbortError") return;
							setState((prev) => ({ phase: "error", data: prev.data, error: error instanceof Error ? error.message : String(error) }));
						}
					}, []);
					react.useEffect(() => {
						load();
						const timer = window.setInterval(load, 60000);
						return () => {
							window.clearInterval(timer);
							abortRef.current?.abort();
						};
					}, [load]);
					return { state, load };
				}
				//#endregion
				//#region AccountMeterCard
				/**
				* Sidebar-footer meter (above Settings at the sidebar foot):
				* wide mode shows "DSH 今日 xxx tokens · ¥xx" inline; click toggles a
				* detail card (opening UPWARD) listing every account (DeepSeek / Kimi)
				* with balance, today's DSH-local spend (tagged 「DSH 消耗」), and the
				* active-account badge. Collapsed rail mode shows a compact "¥" button.
				*/
				function AccountMeterCard({ wide, t }) {
					const { state, load } = useUsage();
					const [open, setOpen] = react.useState(false);
					const [cardAt, setCardAt] = react.useState(null);
					const rootRef = react.useRef(null);
					const { data, phase } = state;
					const ready = data !== null && data !== void 0;
					const spinning = phase === "loading" || phase === "refreshing";
					const accounts = ready && Array.isArray(data.accounts) ? data.accounts : [];
					const activeId = ready ? data.activeAccountId : null;
					const totalBalance = accounts.reduce((sum, a) => {
						const b = a && a.balance;
						return sum + (b && Number.isFinite(b.totalBalance) ? b.totalBalance : 0);
					}, 0);
					const totalTokens = accounts.reduce((sum, a) => {
						const td = a && a.today;
						if (!td || !td.tokens) return sum;
						return sum + (td.tokens.input || 0) + (td.tokens.output || 0) + (td.tokens.cacheRead || 0) + (td.tokens.cacheWrite || 0);
					}, 0);
					const todayCost = accounts.reduce((sum, a) => {
						const td = a && a.today;
						return sum + (td && Number.isFinite(td.cost) ? td.cost : 0);
					}, 0);
					const updatedAt = ready && typeof data.generatedAt === "number" ? data.generatedAt : null;
					const fmtTime = (ms) => {
						const d = new Date(ms);
						const p = (n) => String(n).padStart(2, "0");
						return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
					};
					const toggleCard = () => {
						if (!open) {
							const rect = rootRef.current?.getBoundingClientRect();
							// 向上弹出：卡片底边贴住条顶部（设置在侧边栏底部，向下弹会被视口截断）
							setCardAt(rect ? { left: Math.max(8, rect.left), bottom: window.innerHeight - rect.top + 8 } : null);
						}
						setOpen((prev) => !prev);
					};
					react.useEffect(() => {
						if (!open) return;
						const onKey = (event) => {
							if (event.key === "Escape") setOpen(false);
						};
						const onPointer = (event) => {
							if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false);
						};
						document.addEventListener("keydown", onKey);
						document.addEventListener("pointerdown", onPointer);
						return () => {
							document.removeEventListener("keydown", onKey);
							document.removeEventListener("pointerdown", onPointer);
						};
					}, [open]);
					const refreshBtn = jsx("button", {
						type: "button",
						className: "ud-refresh" + (spinning ? " ud-spin" : ""),
						"aria-label": t("refresh"),
						title: t("refresh"),
						onClick: (event) => {
							event.stopPropagation();
							load();
						},
						children: "\u21BB"
					});
					if (!wide) {
						const tip = t("dshOnly") + " · " + t("today") + " " + fmtTokens(totalTokens) + " · \u00A5" + fmt(todayCost, 2);
						return jsx(_primitives.Tooltip, {
							label: tip,
							delayMs: 400,
							disabled: open,
							children: jsx("button", {
								type: "button",
								ref: rootRef,
								className: "ud-collapsed" + (spinning ? " ud-loading" : ""),
								"aria-label": tip,
								onClick: toggleCard,
								children: "\u00A5"
							})
						});
					}
					const detailCard = open ? jsxs("div", {
						className: "am-card",
						style: cardAt ? { left: Math.max(8, cardAt.left), bottom: Math.max(8, cardAt.bottom) } : void 0,
						onClick: (event) => event.stopPropagation(),
						children: [
							jsxs("div", { className: "am-head", children: [
								jsx("span", { className: "am-title", children: t("cardTitle") }),
								refreshBtn
							] }),
							accounts.length === 0 ? jsx("div", { className: "am-state", children: t("noAccount") })
								: accounts.map((acc) => {
									const bal = acc.balance;
									const today = acc.today;
									const active = acc.id === activeId;
									const balTotal = bal && Number.isFinite(bal.totalBalance) ? bal.totalBalance : null;
									const balError = bal && bal.error;
									const tokens = today && today.tokens
										? (today.tokens.input || 0) + (today.tokens.output || 0) + (today.tokens.cacheRead || 0) + (today.tokens.cacheWrite || 0)
										: 0;
									const cost = today && Number.isFinite(today.cost) ? today.cost : null;
									return jsxs("div", { className: "am-acc" + (active ? " am-active" : ""), children: [
										jsx("div", { className: "am-logo", style: { background: acc.color || "#4d7cfe" }, children: acc.logo || acc.name.slice(0, 1) }),
										jsxs("div", { className: "am-mid", children: [
											jsxs("div", { className: "am-name", children: [
												acc.name,
												active ? jsx("span", { className: "am-badge", children: t("current") }) : null
											] }),
											jsxs("div", { className: "am-usage", children: [
												jsx("span", { className: "am-dsh-tag", children: t("dshOnly") }),
												jsx("span", { className: "am-usage-txt", children: t("today") + " " + fmtTokens(tokens) + " · " + (cost === null ? "—" : "\u00A5" + fmt(cost, 2)) })
											] })
										] }),
										jsxs("div", { className: "am-right", children: [
											jsx("div", { className: "am-bal" + (balError ? " am-err" : ""), children: balError ? t("unavailable") : "\u00A5" + (balTotal === null ? "—" : fmt(balTotal, 2)) }),
											jsx("div", { className: "am-currency", children: bal && !balError && bal.currency ? bal.currency : "" })
										] })
									] }, acc.id);
								}),
							jsxs("div", { className: "am-foot", children: [
								jsxs("span", { className: "am-total", children: [t("total"), " ", jsx("b", { children: "\u00A5" + fmt(totalBalance, 2) })] }),
								jsx("span", { className: "am-updated", children: updatedAt !== null ? t("updatedAt") + " " + fmtTime(updatedAt) : "" })
							] })
						]
					}) : null;
					return jsxs(react.Fragment, {
						children: [
							jsx("div", {
								className: "ud-widget" + (spinning ? " ud-loading" : ""),
								ref: rootRef,
								role: "button",
								tabIndex: 0,
								"aria-expanded": open,
								onClick: toggleCard,
								onKeyDown: (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										toggleCard();
									}
								},
								children: [
									jsx("span", { className: "am-widget-tag", children: t("dshTag") }),
									jsxs("span", { className: "ud-main", children: [
										jsx("span", { className: "ud-label", children: t("today") }),
										jsx("span", { className: "ud-value", children: fmtTokens(totalTokens) + " · \u00A5" + fmt(todayCost, 2) })
									] }),
									refreshBtn
								]
							}),
							detailCard
						]
					});
				}
				//#endregion
				
		// ── formatting helpers ───────────────────────────────────────────────
				function formatTokens(n) {
					if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
					if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "K";
					return String(n);
				}
				function formatDuration(ms) {
					if (ms < 1e3) return ms.toFixed(0) + "ms";
					const s = ms / 1e3;
					if (s < 60) return s.toFixed(1) + "s";
					const m = Math.floor(s / 60);
					return m + "m" + Math.round(s % 60) + "s";
				}
				function formatMoney(cny) {
					if (cny === null || cny === void 0) return "—";
					if (cny === 0) return "¥0";
					const v = Math.abs(cny);
					if (v >= 1) return "¥" + (Math.round(cny * 100) / 100).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
					if (v >= 0.01) return "¥" + (Math.round(cny * 100) / 100).toFixed(2);
					return "¥" + (Math.round(cny * 1e6) / 1e6).toFixed(4);
				}
				function formatTime(ms) {
					const d = new Date(ms);
					const p = (n) => String(n).padStart(2, "0");
					return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
				}
				function formatDate(ms) {
					const d = new Date(ms);
					const p = (n) => String(n).padStart(2, "0");
					return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
				}
				function tpsOf(decodeTokens, decodeMs) {
					if (!decodeMs || !decodeTokens) return null;
					return Math.round((decodeTokens / (decodeMs / 1e3)) * 10) / 10;
				}
				function cacheRatePct(cacheRead, input) {
					const total = cacheRead + input;
					if (total <= 0) return null;
					return Math.round((cacheRead / total) * 1000) / 10;
				}
				function formatRate(pct) {
					if (pct === null) return "—";
					return pct.toFixed(1) + "%";
				}
				function titleOf(item) {
					if (typeof item.title === "string" && item.title !== "") return item.title;
					if (typeof item.cwd === "string" && item.cwd !== "") {
						const base = item.cwd.replace(/[/\\]+$/, "").split(/[/\\]/).pop() ?? "";
						if (base !== "") return base;
					}
					return String(item.sessionId).slice(0, 8);
				}
				function mergeStat(a, b) {
					return {
						provider: a.provider,
						model: a.model,
						calls: a.calls + b.calls,
						llmMs: a.llmMs + b.llmMs,
						ttftMs: a.ttftMs + b.ttftMs,
						ttftSteps: a.ttftSteps + b.ttftSteps,
						decodeMs: a.decodeMs + b.decodeMs,
						decodeTokens: a.decodeTokens + b.decodeTokens,
						inputTokens: a.inputTokens + b.inputTokens,
						outputTokens: a.outputTokens + b.outputTokens,
						cacheReadTokens: a.cacheReadTokens + b.cacheReadTokens,
						cacheWriteTokens: a.cacheWriteTokens + b.cacheWriteTokens,
						reasoningTokens: a.reasoningTokens + b.reasoningTokens,
						estCostCny: (a.estCostCny ?? 0) + (b.estCostCny ?? 0)
					};
				}
				function aggregate(items) {
					const models = new Map();
					const logs = [];
					let truncated = false;
					for (const item of items) {
						const dash = item.projectionValues && item.projectionValues.usageDashboard;
						if (!dash) continue;
						if (dash.truncatedLogs) truncated = true;
						for (const m of dash.models || []) {
							const key = m.provider + "\u0000" + m.model;
							const cur = models.get(key);
							models.set(key, cur ? mergeStat(cur, m) : { ...m });
						}
						for (const log of dash.logs || []) {
							logs.push({ ...log, sessionId: item.sessionId, title: titleOf(item) });
						}
					}
					logs.sort((a, b) => b.time - a.time);
					return { models: [...models.values()], logs, truncated };
				}
		
				// ── sort helper ──────────────────────────────────────────────────────
				function useSort(arr, defaultKey, defaultDir) {
					const [sort, setSort] = react.useState({ key: defaultKey, dir: defaultDir || "desc" });
					const toggle = (key) => {
						setSort((prev) => ({ key, dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc" }));
					};
					const sorted = react.useMemo(() => {
						const list = [...arr];
						list.sort((a, b) => {
							const va = typeof a[sort.key] === "function" ? a[sort.key]() : a[sort.key];
							const vb = typeof b[sort.key] === "function" ? b[sort.key]() : b[sort.key];
							if (va == null) return 1;
							if (vb == null) return -1;
							if (typeof va === "string") return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
							return sort.dir === "asc" ? va - vb : vb - va;
						});
						return list;
					}, [arr, sort.key, sort.dir]);
					return { sorted, sort, toggle };
				}
		
				// ── dashboard component ──────────────────────────────────────────────
				function UsageDashboardTab({ listSessions, subscribe, t }) {
					const [snapshot, setSnapshot] = react.useState(() => listSessions());
					const [search, setSearch] = react.useState("");
					const [providerFilter, setProviderFilter] = react.useState("");
					const [modelFilter, setModelFilter] = react.useState("");
					const [sessionFilter, setSessionFilter] = react.useState("");
					const [dateStart, setDateStart] = react.useState("");
					const [dateEnd, setDateEnd] = react.useState("");
					const [externalCalls, setExternalCalls] = react.useState([]);
					const [apiData, setApiData] = react.useState(null);
					react.useEffect(() => {
						return subscribe(() => setSnapshot(listSessions()));
					}, [listSessions, subscribe]);
					react.useEffect(() => {
						let alive = true;
						const load = async () => {
							try {
								const res = await fetch("/api/dsh-usage", { cache: "no-store" });
								const data = await res.json();
								if (!alive) return;
								if (data && data.ok) setApiData(data);
								setExternalCalls(Array.isArray(data.externalCalls) ? data.externalCalls : []);
							} catch {
								/* 外部调用列表不可用时保持为空 */
							}
						};
						load();
						const timer = setInterval(load, 60000);
						return () => { alive = false; clearInterval(timer); };
					}, []);

					const { models, logs, truncated } = react.useMemo(() => {
						const items = snapshot ? Object.values(snapshot.byId || {}) : [];
						const agg = aggregate(items);
						for (const row of externalCalls) {
							agg.logs.push({ ...row, sessionId: null, title: "视觉调用" });
							const cur = agg.models.find((m) => m.provider === row.provider && m.model === row.model);
							if (cur) {
								cur.calls += 1;
								cur.inputTokens += row.inputTokens || 0;
								cur.outputTokens += row.outputTokens || 0;
								cur.cacheReadTokens += row.cacheReadTokens || 0;
								cur.cacheWriteTokens += row.cacheWriteTokens || 0;
								cur.reasoningTokens += row.reasoningTokens || 0;
								if (row.estCostCny !== null && row.estCostCny !== undefined) cur.estCostCny = (cur.estCostCny ?? 0) + row.estCostCny;
							} else {
								agg.models.push({
									provider: row.provider,
									model: row.model,
									calls: 1,
									llmMs: 0,
									ttftMs: 0,
									ttftSteps: 0,
									decodeMs: 0,
									decodeTokens: 0,
									inputTokens: row.inputTokens || 0,
									outputTokens: row.outputTokens || 0,
									cacheReadTokens: row.cacheReadTokens || 0,
									cacheWriteTokens: row.cacheWriteTokens || 0,
									reasoningTokens: row.reasoningTokens || 0,
									estCostCny: row.estCostCny ?? null
								});
							}
						}
						agg.logs.sort((a, b) => b.time - a.time);
						return agg;
					}, [snapshot, externalCalls]);
		
					const sessionCount = snapshot ? Object.keys(snapshot.byId || {}).length : 0;
					const providers = react.useMemo(() => [...new Set(models.map((m) => m.provider))].sort(), [models]);
					const modelIds = react.useMemo(() => [...new Set(models.map((m) => m.model))].sort(), [models]);
					const sessionTitles = react.useMemo(() => {
						const map = new Map();
						if (snapshot) for (const [id, item] of Object.entries(snapshot.byId || {})) map.set(id, titleOf(item));
						return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
					}, [snapshot]);
		
					const q = search.trim().toLowerCase();
					const filteredModels = models.filter((m) =>
						(providerFilter === "" || m.provider === providerFilter) &&
						(modelFilter === "" || m.model === modelFilter) &&
						(q === "" || m.provider.toLowerCase().includes(q) || m.model.toLowerCase().includes(q))
					);
					const filteredLogs = logs.filter((l) => {
						if (providerFilter !== "" && l.provider !== providerFilter) return false;
						if (modelFilter !== "" && l.model !== modelFilter) return false;
						if (sessionFilter !== "" && l.sessionId !== sessionFilter) return false;
						if (q !== "" && !l.provider.toLowerCase().includes(q) && !l.model.toLowerCase().includes(q) && !(l.title || "").toLowerCase().includes(q)) return false;
						if (dateStart !== "" && l.time < new Date(dateStart).getTime()) return false;
						if (dateEnd !== "") {
							const end = new Date(dateEnd);
							end.setHours(23, 59, 59, 999);
							if (l.time > end.getTime()) return false;
						}
						return true;
					});
		
					const totals = filteredModels.reduce((acc, m) => ({
						calls: acc.calls + m.calls,
						cost: acc.cost + (m.estCostCny ?? 0),
						unknownCost: acc.unknownCost || m.estCostCny === null,
						input: acc.input + m.inputTokens,
						output: acc.output + m.outputTokens,
						cacheRead: acc.cacheRead + m.cacheReadTokens,
						cacheWrite: acc.cacheWrite + m.cacheWriteTokens
					}), { calls: 0, cost: 0, unknownCost: false, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
					totals.cacheRate = cacheRatePct(totals.cacheRead, totals.input);
		
					// 顶部统计卡数据源：优先用 /api/dsh-usage 的今日汇总（与侧边栏同源、同计价），
					// 避免投影（仅已加载会话 + 旧价表）造成的数字差异。
					const apiTotal = apiData && apiData.total ? apiData.total : null;
					const apiTotals = apiTotal ? {
						calls: apiTotal.calls ?? 0,
						cost: Number.isFinite(apiTotal.cost) ? apiTotal.cost : 0,
						unknownCost: false,
						input: apiTotal.tokens?.input ?? 0,
						output: apiTotal.tokens?.output ?? 0,
						cacheRead: apiTotal.tokens?.cacheRead ?? 0,
						cacheWrite: apiTotal.tokens?.cacheWrite ?? 0,
						cacheRate: cacheRatePct(apiTotal.tokens?.cacheRead ?? 0, apiTotal.tokens?.input ?? 0)
					} : null;
					const overview = apiTotals !== null ? apiTotals : totals;
		
					const providerTotals = providers.map((p) => {
						const list = models.filter((m) => m.provider === p);
						return {
							provider: p,
							calls: list.reduce((a, m) => a + m.calls, 0),
							cost: list.reduce((a, m) => a + (m.estCostCny ?? 0), 0),
							models: list.length,
							cacheRate: cacheRatePct(
								list.reduce((a, m) => a + m.cacheReadTokens, 0),
								list.reduce((a, m) => a + m.inputTokens, 0)
							)
						};
					});
		
					const { sorted: sortedModels, sort: modelSort, toggle: toggleModelSort } = useSort(filteredModels, "calls", "desc");
					const { sorted: sortedLogs, sort: logSort, toggle: toggleLogSort } = useSort(filteredLogs, "time", "desc");
		
					const SortIcon = ({ sortKey, current }) => {
						if (current.key !== sortKey) return null;
						return jsx("span", { className: "ud-sort", children: current.dir === "asc" ? "▲" : "▼" });
					};
		
					const CacheRatePill = ({ cacheRead, input }) => {
						const pct = cacheRatePct(cacheRead, input);
						const high = pct !== null && pct >= 50;
						return jsx("span", {
							className: "ud-pill ud-pillRate",
							"data-high": high,
							children: formatRate(pct)
						});
					};
		
					return jsxs("div", { className: "ud-root", children: [
						jsxs("div", { children: [
							jsx("h2", { children: t("heading") }),
							jsx("div", { className: "ud-mt", children: t("sub") })
						] }),
						jsxs("div", { className: "ud-filters", children: [
							jsx("input", {
								className: "ud-search",
								type: "search",
								placeholder: t("search.placeholder"),
								value: search,
								onChange: (e) => setSearch(e.target.value)
							}),
							jsx("select", {
								className: "ud-select",
								value: providerFilter,
								onChange: (e) => setProviderFilter(e.target.value),
								children: [
									jsx("option", { value: "", children: t("filter.provider") }),
									...providers.map((p) => jsx("option", { value: p, children: p }, p))
								]
							}),
							jsx("select", {
								className: "ud-select",
								value: modelFilter,
								onChange: (e) => setModelFilter(e.target.value),
								children: [
									jsx("option", { value: "", children: t("filter.model") }),
									...modelIds.map((m) => jsx("option", { value: m, children: m }, m))
								]
							}),
							jsx("select", {
								className: "ud-select",
								value: sessionFilter,
								onChange: (e) => setSessionFilter(e.target.value),
								children: [
									jsx("option", { value: "", children: t("filter.session") }),
									...sessionTitles.map(([id, title]) => jsx("option", { value: id, children: title }, id))
								]
							}),
							jsx("input", {
								className: "ud-date",
								type: "date",
								value: dateStart,
								onChange: (e) => setDateStart(e.target.value),
								placeholder: t("date.start"),
								title: t("date.start")
							}),
							jsx("input", {
								className: "ud-date",
								type: "date",
								value: dateEnd,
								onChange: (e) => setDateEnd(e.target.value),
								placeholder: t("date.end"),
								title: t("date.end")
							})
						] }),
						jsxs("div", { className: "ud-toolbar", children: [
							jsx("button", { className: "ud-btn", onClick: () => setSnapshot(listSessions()), children: [jsx("span", { className: "ud-icon", children: "\u21BB" }), "刷新"] }),
							jsx("button", { className: "ud-btn", onClick: () => {
								const rows = [["时间","会话","供应商","模型","耗时(ms)","首token(ms)","tok/s","缓存率(%)","输入","输出","缓存读","缓存写","费用(CNY)"]];
								filteredLogs.forEach(l => {
									const rate = cacheRatePct(l.cacheReadTokens, l.inputTokens);
									const tps = tpsOf(l.outputTokens, l.decodeMs);
									rows.push([formatTime(l.time), l.title || l.sessionId, l.provider, l.model, String(Math.round(l.llmMs)), l.ttftMs === null ? "" : String(Math.round(l.ttftMs)), tps === null ? "" : String(tps), rate === null ? "" : String(rate), String(l.inputTokens), String(l.outputTokens), String(l.cacheReadTokens), String(l.cacheWriteTokens), l.estCostCny === null ? "" : String(l.estCostCny)]);
								});
								const csv = rows.map(r => r.map(c => { const s = String(c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(",")).join("\n");
								const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url; a.download = "dsh-stats-" + new Date().toISOString().slice(0,10) + ".csv";
								document.body.appendChild(a); a.click(); document.body.removeChild(a);
								URL.revokeObjectURL(url);
							}, children: [jsx("span", { className: "ud-icon", children: "\u2193" }), "导出 CSV"] })
						] }),
						jsxs("div", { className: "ud-cards ud-cards4", children: [
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.calls") }),
								jsx("span", { className: "ud-statValue ud-strong", children: String(overview.calls) })
							] }),
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.cost") }),
								jsx("span", { className: "ud-statValue ud-strong", children: overview.unknownCost && overview.calls === 0 ? t("overview.unknownCost") : formatMoney(overview.cost) })
							] }),
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.cacheRate") }),
								jsx("span", { className: "ud-statValue ud-good", children: formatRate(overview.cacheRate) })
							] }),
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.output") }),
								jsx("span", { className: "ud-statValue", children: formatTokens(overview.output) })
							] }),
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.input") }),
								jsx("span", { className: "ud-statValue", children: formatTokens(overview.input) })
							] }),
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.cacheRead") }),
								jsx("span", { className: "ud-statValue", children: formatTokens(overview.cacheRead) })
							] }),
							jsxs("div", { className: "ud-stat", children: [
								jsx("span", { className: "ud-statLabel", children: t("overview.cacheWrite") }),
								jsx("span", { className: "ud-statValue", children: formatTokens(overview.cacheWrite) })
							] })
						] }),
						jsx("div", { className: "ud-note", children: "顶部统计为今日数据（与侧边栏同源：官方余额 + 会话日志 × 峰谷计价）。下方按模型/会话明细来自会话投影，仅覆盖当前已加载会话，数字可能小于顶部。" }) ,
						jsxs("div", { className: "ud-providers", children: [
							jsx("h3", { children: t("providers.title") }),
							jsxs("div", { className: "ud-chipRow", children: providerTotals.map((p) =>
								jsxs("span", { className: "ud-chip", "data-active": providerFilter === p.provider, onClick: () => setProviderFilter(providerFilter === p.provider ? "" : p.provider), children: [
									jsx("b", { children: p.provider }),
									jsx("span", { children: `${p.models} 模型 · ${p.calls} 次` }),
									jsx("span", { children: formatMoney(p.cost) }),
									p.cacheRate !== null ? jsx("span", { className: "ud-pill ud-pillRate", "data-high": p.cacheRate >= 50, children: formatRate(p.cacheRate) }) : null
								] }, p.provider)
							) })
						] }),
						models.length === 0
							? jsx("div", { className: "ud-empty", children: t("empty") })
							: jsxs(Fragment, { children: [
								jsxs("div", { className: "ud-section", children: [
									jsx("h3", { children: t("models.title") }),
									jsxs("div", { className: "ud-tableWrap", children: [
										jsxs("table", { className: "ud-table", children: [
											jsxs("thead", { children: [
												jsx("tr", { children: [
													jsx("th", { onClick: () => toggleModelSort("provider"), children: [t("col.provider"), jsx(SortIcon, { sortKey: "provider", current: modelSort })] }),
													jsx("th", { onClick: () => toggleModelSort("model"), children: [t("col.model"), jsx(SortIcon, { sortKey: "model", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("calls"), children: [t("col.calls"), jsx(SortIcon, { sortKey: "calls", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("llmMs"), children: [t("col.avgLlm"), jsx(SortIcon, { sortKey: "llmMs", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("ttftMs"), children: [t("col.avgTtft"), jsx(SortIcon, { sortKey: "ttftMs", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("avgTps"), children: [t("col.avgTps"), jsx(SortIcon, { sortKey: "avgTps", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("cacheRate"), children: [t("col.cacheRate"), jsx(SortIcon, { sortKey: "cacheRate", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("inputTokens"), children: [t("col.input"), jsx(SortIcon, { sortKey: "inputTokens", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("outputTokens"), children: [t("col.output"), jsx(SortIcon, { sortKey: "outputTokens", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("cacheReadTokens"), children: [t("col.cacheRead"), jsx(SortIcon, { sortKey: "cacheReadTokens", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("cacheWriteTokens"), children: [t("col.cacheWrite"), jsx(SortIcon, { sortKey: "cacheWriteTokens", current: modelSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleModelSort("estCostCny"), children: [t("col.cost"), jsx(SortIcon, { sortKey: "estCostCny", current: modelSort })] })
												] })
											] }),
											jsx("tbody", { children: sortedModels.map((m) =>
												jsxs("tr", { children: [
													jsx("td", { children: jsx("span", { className: "ud-pill ud-pillProv", children: m.provider }) }),
													jsx("td", { children: jsx("span", { className: "ud-pill ud-pillModel", children: m.model }) }),
													jsx("td", { className: "ud-num", children: String(m.calls) }),
													jsx("td", { className: "ud-num", children: m.calls > 0 ? formatDuration(m.llmMs / m.calls) : "—" }),
													jsx("td", { className: "ud-num", children: m.ttftSteps > 0 ? formatDuration(m.ttftMs / m.ttftSteps) : "—" }),
													jsx("td", { className: "ud-num", children: m.decodeMs > 0 ? String(tpsOf(m.decodeTokens, m.decodeMs)) : "—" }),
													jsx("td", { className: "ud-num", children: jsx(CacheRatePill, { cacheRead: m.cacheReadTokens, input: m.inputTokens }) }),
													jsx("td", { className: "ud-num", children: formatTokens(m.inputTokens) }),
													jsx("td", { className: "ud-num", children: formatTokens(m.outputTokens) }),
													jsx("td", { className: "ud-num", children: formatTokens(m.cacheReadTokens) }),
													jsx("td", { className: "ud-num", children: formatTokens(m.cacheWriteTokens) }),
													jsx("td", { className: "ud-num", children: m.estCostCny === null ? "—" : formatMoney(m.estCostCny) })
												] }, m.provider + m.model)
											) })
										] })
									] })
								] }),
								jsxs("div", { className: "ud-section", children: [
									jsx("div", { className: "ud-row", children: [
										jsx("h3", { children: t("logs.title") }),
										jsx("span", { className: "ud-mt", children: `(${filteredLogs.length} 条)` })
									] }),
									truncated ? jsx("div", { className: "ud-trn", children: t("truncated") }) : null,
									jsxs("div", { className: "ud-tableWrap", children: [
										jsxs("table", { className: "ud-table", children: [
											jsxs("thead", { children: [
												jsx("tr", { children: [
													jsx("th", { onClick: () => toggleLogSort("time"), children: [t("col.time"), jsx(SortIcon, { sortKey: "time", current: logSort })] }),
													jsx("th", { onClick: () => toggleLogSort("title"), children: [t("col.session"), jsx(SortIcon, { sortKey: "title", current: logSort })] }),
													jsx("th", { onClick: () => toggleLogSort("provider"), children: [t("col.provider"), jsx(SortIcon, { sortKey: "provider", current: logSort })] }),
													jsx("th", { onClick: () => toggleLogSort("model"), children: [t("col.model"), jsx(SortIcon, { sortKey: "model", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("llmMs"), children: [t("col.llm"), jsx(SortIcon, { sortKey: "llmMs", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("ttftMs"), children: [t("col.ttft"), jsx(SortIcon, { sortKey: "ttftMs", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("outputTokens"), children: [t("col.tps"), jsx(SortIcon, { sortKey: "outputTokens", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("cacheRate"), children: [t("col.rate"), jsx(SortIcon, { sortKey: "cacheRate", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("inputTokens"), children: [t("col.input"), jsx(SortIcon, { sortKey: "inputTokens", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("outputTokens"), children: [t("col.output"), jsx(SortIcon, { sortKey: "outputTokens", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("cacheReadTokens"), children: [t("col.cacheRead"), jsx(SortIcon, { sortKey: "cacheReadTokens", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("cacheWriteTokens"), children: [t("col.cacheWrite"), jsx(SortIcon, { sortKey: "cacheWriteTokens", current: logSort })] }),
													jsx("th", { className: "ud-num", onClick: () => toggleLogSort("estCostCny"), children: [t("col.cost"), jsx(SortIcon, { sortKey: "estCostCny", current: logSort })] })
												] })
											] }),
											jsx("tbody", { children: sortedLogs.slice(0, 500).map((l, i) =>
												jsxs("tr", { children: [
													jsx("td", { children: formatTime(l.time) }),
													jsx("td", { children: jsx("span", { className: "ud-pill ud-pillModel", children: l.title }) }),
													jsx("td", { children: l.provider }),
													jsx("td", { children: l.model }),
													jsx("td", { className: "ud-num", children: formatDuration(l.llmMs) }),
													jsx("td", { className: "ud-num", children: l.ttftMs === null ? "—" : formatDuration(l.ttftMs) }),
													jsx("td", { className: "ud-num", children: tpsOf(l.outputTokens, l.decodeMs) === null ? "—" : String(tpsOf(l.outputTokens, l.decodeMs)) }),
													jsx("td", { className: "ud-num", children: jsx(CacheRatePill, { cacheRead: l.cacheReadTokens, input: l.inputTokens }) }),
													jsx("td", { className: "ud-num", children: formatTokens(l.inputTokens) }),
													jsx("td", { className: "ud-num", children: formatTokens(l.outputTokens) }),
													jsx("td", { className: "ud-num", children: formatTokens(l.cacheReadTokens) }),
													jsx("td", { className: "ud-num", children: formatTokens(l.cacheWriteTokens) }),
													jsx("td", { className: "ud-num", children: l.estCostCny === null ? "—" : formatMoney(l.estCostCny) })
												] }, String(l.time) + "-" + i)
											) })
										] })
									] })
								] })
							] }),
						jsx("div", { className: "ud-nt", children: t("cost.note") }),
						jsx("div", { className: "ud-footer", children: t("footer", { sessions: String(sessionCount), logs: String(logs.length) }) }),
						jsx("div", { className: "am-form-sep", children: null }),
						jsx(AccountConfigEditor, {})
					] });
				}
		
				
		// ── account config editor (fetch-driven; no client settings service) ──
				/**
				* 账户配置编辑器：通过 /api/dsh-usage/config 读写 host settings。
				* 不依赖 client 侧 settingsScope 服务（本环境不存在），纯 fetch。
				* 保存后写入 settings 的 accounts 字段，侧边栏卡片下次请求即生效。
				*/
				function AccountConfigEditor() {
					const [loaded, setLoaded] = react.useState(false);
					const [saving, setSaving] = react.useState(false);
					const [error, setError] = react.useState(null);
					const [list, setList] = react.useState(null);
					const [defaults, setDefaults] = react.useState([]);
					react.useEffect(() => {
						let alive = true;
						(async () => {
							try {
								const res = await fetch("/api/dsh-usage/config", { cache: "no-store" });
								const data = await res.json();
								if (!alive) return;
								if (data && data.ok) {
									const base = Array.isArray(data.configured) && data.configured.length > 0 ? data.configured : [];
									setList(base.map((a) => ({ ...a, modelPrefixes: [...(a.modelPrefixes || [])], providerKeys: [...(a.providerKeys || [])] })));
									setDefaults(Array.isArray(data.defaults) ? data.defaults : []);
								} else {
									setError((data && data.error) || "加载配置失败");
								}
							} catch (loadError) {
								if (alive) setError(loadError instanceof Error ? loadError.message : String(loadError));
							} finally {
								if (alive) setLoaded(true);
							}
						})();
						return () => { alive = false; };
					}, []);
					const update = (i, patch) => setList(list.map((a, idx) => idx === i ? { ...a, ...patch } : a));
					const addAccount = () => setList([...list, {
						id: "", name: "", keyRef: "", baseURL: "", balancePath: "/user/balance",
						modelPrefixes: [], providerKeys: [], logo: "", color: "#4d7cfe"
					}]);
					const removeAccount = (i) => setList(list.filter((_, idx) => idx !== i));
					const save = async () => {
						setSaving(true);
						setError(null);
						const clean = list
							.filter((a) => a && typeof a.id === "string" && a.id.trim() !== "")
							.map((a) => ({
								id: a.id.trim(),
								name: (a.name || "").trim(),
								keyRef: (a.keyRef || "").trim(),
								baseURL: (a.baseURL || "").trim(),
								balancePath: (a.balancePath || "/user/balance").trim(),
								modelPrefixes: (a.modelPrefixes || []).map((p) => p.trim()).filter(Boolean),
								providerKeys: (a.providerKeys || []).map((p) => p.trim()).filter(Boolean),
								logo: (a.logo || "").trim() || a.id.trim().slice(0, 1).toUpperCase(),
								color: (a.color || "#4d7cfe").trim()
							}));
						try {
							const res = await fetch("/api/dsh-usage/config", {
								method: "POST",
								headers: { "content-type": "application/json" },
								body: JSON.stringify({ accounts: clean })
							});
							const data = await res.json();
							if (!data || data.ok !== true) {
								setError((data && data.error) || "保存失败");
							} else {
								setList(data.accounts.map((a) => ({ ...a, modelPrefixes: [...(a.modelPrefixes || [])], providerKeys: [...(a.providerKeys || [])] })));
							}
						} catch (saveError) {
							setError(saveError instanceof Error ? saveError.message : String(saveError));
						} finally {
							setSaving(false);
						}
					};
					const reset = async () => {
						setSaving(true);
						setError(null);
						try {
							const res = await fetch("/api/dsh-usage/config", {
								method: "POST",
								headers: { "content-type": "application/json" },
								body: JSON.stringify({ accounts: [] })
							});
							const data = await res.json();
							if (!data || data.ok !== true) {
								setError((data && data.error) || "重置失败");
							} else {
								setList([]);
							}
						} catch (resetError) {
							setError(resetError instanceof Error ? resetError.message : String(resetError));
						} finally {
							setSaving(false);
						}
					};
					if (!loaded) {
						return jsx("div", { className: "am-form-root", children: jsx("div", { className: "am-form-hint", children: "加载账户配置中…" }) });
					}
					const prefixText = (arr) => (arr || []).join(", ");
					const setPrefixes = (i, text) => update(i, { modelPrefixes: text.split(",").map((s) => s.trim()).filter(Boolean) });
					const setProviders = (i, text) => update(i, { providerKeys: text.split(",").map((s) => s.trim()).filter(Boolean) });
					const field = (i, key, label, ph) => jsxs("label", { className: "am-form-field", children: [
						jsx("span", { className: "am-form-label", children: label }),
						jsx("input", { className: "am-form-input", value: (list[i] && list[i][key]) || "", placeholder: ph || "", onChange: (e) => update(i, { [key]: e.target.value }) })
					] });
					const cards = list.map((a, i) => jsxs("div", { className: "am-form-acc", children: [
						jsxs("div", { className: "am-form-acc-head", children: [
							jsx("span", { className: "am-form-acc-title", children: (a && a.name) || (a && a.id) || ("账户 " + (i + 1)) }),
							jsx("button", { type: "button", className: "am-form-del", onClick: () => removeAccount(i), children: "删除" })
						] }),
						jsxs("div", { className: "am-form-grid", children: [
							field(i, "id", "ID", "deepseek"),
							field(i, "name", "名称", "DeepSeek"),
							field(i, "keyRef", "API Key 引用", "DEEPSEEK_API_KEY"),
							field(i, "baseURL", "余额接口基址", "https://api.deepseek.com"),
							field(i, "balancePath", "余额接口路径", "/user/balance")
						] }),
						jsxs("div", { className: "am-form-grid", children: [
							jsxs("label", { className: "am-form-field", children: [
								jsx("span", { className: "am-form-label", children: "模型前缀（逗号分隔）" }),
								jsx("input", { className: "am-form-input", value: prefixText(a.modelPrefixes), placeholder: "deepseek-, moonshot-, kimi-", onChange: (e) => setPrefixes(i, e.target.value) })
							] }),
							jsxs("label", { className: "am-form-field", children: [
								jsx("span", { className: "am-form-label", children: "Provider 标识（逗号分隔）" }),
								jsx("input", { className: "am-form-input", value: prefixText(a.providerKeys), placeholder: "deepseek, deepseek-official", onChange: (e) => setProviders(i, e.target.value) })
							] }),
							field(i, "logo", "Logo 字符", "深"),
							field(i, "color", "颜色", "#4d7cfe")
						] })
					] }, a && (a.id || i)));
					return jsxs("div", { className: "am-form-root", children: [
						jsx("h3", { className: "am-form-heading", children: "账户计量 · 账户列表" }),
						jsx("div", { className: "am-form-hint", children: "配置保存在 ~/.dsh/settings.yaml 的 account-meter 段。留空使用内置默认（DeepSeek + Kimi）。保存后侧边栏卡片即时生效。" }),
						error ? jsx("div", { className: "am-form-err", children: "⚠ " + error }) : null,
						cards.length === 0 ? jsx("div", { className: "am-form-empty", children: "当前使用内置默认账户（" + defaults.map((d) => d.name).join(" + ") + "）。添加账户并保存后即可覆盖。" }) : null,
						jsx("button", { type: "button", className: "am-form-add", onClick: addAccount, children: "+ 添加账户" }),
						jsxs("div", { className: "am-form-actions", children: [
							jsx("button", { type: "button", className: "am-form-btn am-form-btn-primary", onClick: save, disabled: saving, children: saving ? "保存中…" : "保存" }),
							jsx("button", { type: "button", className: "am-form-btn", onClick: reset, disabled: saving, children: "重置为默认" })
						] }),
						jsx("div", { className: "am-form-note", children: "提示：accounts 留空时自动使用内置 DeepSeek + Kimi；「重置为默认」会把自定义列表清空。" })
					] });
				}
		
		//#region index
		const inject = ["slots", "locale", "sessions"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "account-meter: card dictionaries");
			ctx.effect(() => ctx.locale.register(NS_DASH, { zh: zhDash, en: enDash }), "account-meter: dashboard dictionaries");
			const tDash = ctx.locale.bind(NS_DASH);
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "account-meter",
				order: 10,
				locale: NS
			}, AccountMeterCard));
			ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
				name: "settings.plugins.tab",
				id: "account-meter",
				order: 20,
				label: () => tDash("tab"),
				locale: NS_DASH,
				inject: () => ({
					listSessions: () => ctx.sessions.list.getSnapshot(),
					subscribe: (cb) => ctx.sessions.list.subscribe(cb)
				})
			}, UsageDashboardTab));
		}
		//#endregion
		exports.NS = NS;
		exports.NS_DASH = NS_DASH;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
