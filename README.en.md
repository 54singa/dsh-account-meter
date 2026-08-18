# dsh-account-meter

A **account meter** for the DeepSeek Harness (dsh) Web GUI. Shows **today's DSH token spend and estimated cost** in the sidebar (above Settings), expands to show **per-provider balance and today's DSH usage**, and provides a **visual account editor** in the settings page.

Multi-provider (DeepSeek / Kimi / any provider) balance and usage at a glance, with the **「DSH usage」scope clearly labeled** — never confused with your provider-account total spend.

## Features

- **Sidebar meter** (above the Settings button): `[DSH] Today 105.2M · ¥22.31 ⟳`
  - Today's DSH token spend (incl. cache reads) and estimated cost at peak/off-peak rates
  - Auto-refresh every 30s + manual refresh button
  - Collapses to a compact `¥` button when the sidebar is in rail mode
- **Detail card** (opens upward): one row per account
  - Account balance (queried from the official provider API) + today's DSH tokens / cost
  - **「Active」badge** for the currently selected model's provider (auto-follows)
  - Footer: total balance across accounts + last-updated time
- **Settings → 「账户计量」section** (inside the Stats tab): visual account editor
  - Add / remove accounts, configure API-key refs, balance endpoints, model prefixes, provider keys
  - Save writes to `~/.dsh/settings.yaml`; the sidebar updates on the next refresh — no restart needed
- **Stats dashboard** (Settings → Plugins → Stats): per-model / per-session call logs, token usage, cost estimates, CSV export

## Data scope (important)

| Data | Scope | Source |
|---|---|---|
| **Account balance** | Provider account (real) | Official provider API (DeepSeek `/user/balance`, Kimi `/v1/users/me/balance`) |
| **Today's spend tokens** | **DSH only** | Aggregated from `~/.dsh/sessions` session logs |
| **Estimated cost** | Estimate | Built-in price table × peak/off-peak schedule (DeepSeek from 2026-08-17) |

> ⚠️ Spend is **usage inside DSH** only — it does not include usage of the same API key from the DeepSeek website or other tools. Providers expose only a balance endpoint, not an account-total-usage endpoint.

## Install

```sh
dsh plugin --profile desktop add dsh-account-meter
# or from source
dsh plugin --profile desktop add /path/to/dsh-account-meter
```

Restart dsh (profiles are not hot-reloaded). The meter appears above the Settings button in the sidebar.

## Configuration

### Option A: Visual editor (recommended)

Settings → Plugins → Stats → scroll to **「账户计量 · 账户列表」** → Add account → Save.

### Option B: Edit settings.yaml directly

Add to `~/.dsh/settings.yaml`:

```yaml
account-meter:
  accounts:
    - id: deepseek
      name: DeepSeek
      keyRef: DEEPSEEK_API_KEY
      baseURL: https://api.deepseek.com
      balancePath: /user/balance
      modelPrefixes: [deepseek-]
      providerKeys: [deepseek, deepseek-official]
      logo: 深
      color: '#4d7cfe'
    - id: kimi
      name: Kimi
      keyRef: KIMI_CODING_API_KEY
      baseURL: https://api.moonshot.cn
      balancePath: /v1/users/me/balance
      modelPrefixes: [moonshot-, kimi-]
      providerKeys: [moonshot, kimi]
      logo: K
      color: '#2fae78'
```

Field reference:

| Field | Meaning |
|---|---|
| `id` | Stable unique identifier |
| `name` | Display name |
| `keyRef` | API-key reference name in `~/.dsh/.credentials.yaml` |
| `baseURL` | Balance API base URL |
| `balancePath` | Balance API path |
| `modelPrefixes` | Model-name prefixes attributed to this account (spend splitting) |
| `providerKeys` | Provider identifiers of the current model selection (`active` detection) |
| `logo` / `color` | Display |

An empty `accounts` falls back to the built-in defaults (DeepSeek + Kimi).

## Adding a new provider (example: OpenRouter)

```yaml
account-meter:
  accounts:
    - id: openrouter
      name: OpenRouter
      keyRef: OPENROUTER_API_KEY
      baseURL: https://openrouter.ai
      balancePath: /api/v1/credits
      modelPrefixes: [openrouter/, deepseek/]
      providerKeys: [openrouter]
      logo: OR
      color: '#ff6b35'
```

You also need `OPENROUTER_API_KEY` in `~/.dsh/.credentials.yaml`, otherwise the balance shows "未配置 API Key".

## Development

```
lib/index.js    # host half: balance + spend estimation + /api/dsh-usage(/config) routes + session projection
lib/client.js   # client half: sidebar meter + detail card + settings account editor + stats dashboard
cordis.patch.yml # bundle patch: inserts the plugin row into the profile loader
```

- API: `GET /api/dsh-usage` (balance + spend), `GET|POST /api/dsh-usage/config` (account config read/write)
- Spend: scans `session.jsonl.zstd` under `~/.dsh/sessions`, aggregates `assistant/message` usage, attributes by model prefix, prices by peak/off-peak table
- Pricing: `DEFAULT_PRICES` (base) + `DEFAULT_PRICE_SCHEDULE` (peak/off-peak from 2026-08-17), overridable via settings `prices`/`priceSchedule`

## License

MIT © [54singa](https://github.com/54singa)

---

*Forked from [dsh-usage-dashboard-plus](https://github.com/1HelloMan1/dsh-usage-dashboard-plus), heavily reworked into a multi-account architecture.*
