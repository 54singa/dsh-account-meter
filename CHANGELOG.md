# Changelog

All notable changes to **dsh-account-meter** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/lang/zh-CN/).

## [0.1.1] - 2026-08-18

### 修复

- 设置页可视化账户编辑器：改用 `ctx.inject(["settings"])` 依赖注入（cordis 标准方式）读取 host settings，修复保存账户配置时 `settings service unavailable` 的问题（此前 `ctx.get("settings")` 在 apply 顶层同步调用拿不到服务）
- 账户行消费统计按天分组：修复账户明细（展开卡）把 48 小时扫描窗口内所有天的消费都累计进"今日"的 bug——现在账户行与侧边栏今日合计完全一致
- 设置页统计看板顶部统计卡改为与侧边栏同源（`/api/dsh-usage` 的今日汇总 + 峰谷计价），修复看板显示 ¥4.44 而侧边栏显示 ¥22+ 的口径差异
- 移除调试用的 `settingsReady` 内部状态字段，API 响应只保留对用户有用的 `settingsError`

### 新增

- 右侧悬浮卡 → 改为左侧栏设置按钮上方的常驻计量条（`sidebar.footer.action`），点击向上弹出多账户明细卡
- 设置页「账户计量」可视化账户配置区块（统计看板 tab 内）
- 多账户支持：DeepSeek / Kimi 内置默认，任意服务商可通过 settings 配置（`account-meter.accounts`）
- 「DSH 消耗」口径明确标注，与账户总余额区分

## [0.1.0] - 2026-08-18

### 新增

- 首个版本：fork 自 [dsh-usage-dashboard-plus](https://github.com/1HelloMan1/dsh-usage-dashboard-plus)
- 侧边栏计量条：DSH 今日 token 总消耗 + 峰谷计价估算
- 多账户余额查询（DeepSeek `/user/balance`、Kimi `/v1/users/me/balance`）
- 「当前接入」账户高亮（跟随当前模型选择）
- 统计看板（按模型 / 会话的调用日志、token、费用、CSV 导出）
