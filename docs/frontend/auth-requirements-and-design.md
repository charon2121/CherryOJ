# Cherry OJ 前端登录/认证需求与设计文档

## 1. 背景与目标

当前系统已经具备登录、注册、`/me`、登出等基础能力；**主干认证链路已在代码中实现**，剩余与增强项见 **第 2 节 TODO 清单**。

本文档目标：

- 总结现阶段登录/认证的完整需求。
- 给出可落地的前后端设计方案与分阶段实施路径。

## 2. 现状总结

本节用 **TODO 清单** 对照「文档描述的能力」与「当前实现」，便于迭代时勾选与评审。`[x]` 表示已在仓库中落地；`[ ]` 表示尚未完成或仅部分完成。

### 2.1 前端（`cherry-ui`）

- 浏览器请求封装 `clientFetch`，`credentials: "include"`，可携带 Cookie。
- 认证相关接口封装：`loginWithPassword`、`registerAccount`、`fetchCurrentUser`、`logout`、`requestPasswordReset`（重置仍为后端占位能力）。
- 全局用户状态：Zustand `auth.store` 仅承载用户快照；用户身份由服务端 layout 通过 `AuthSnapshot` 注入，不再在客户端启动时拉 `/me`。
- 登录/注册成功后写入 store 并跳转；支持安全 `returnUrl`；题目工作台等需要登录的页面由服务端页面入口完成首层拦截。
- `clientFetch` 遇业务码 401 时派发 `auth:unauthorized`，由 `AuthProvider` 清空登录态。
- 请求层对 **403** 的统一交互（提示无权限、可选跳转/禁用操作），与 401 策略对齐。
- 管理端由 `admin/layout.tsx` 服务端完成管理员校验；前端已不再使用 `RequireAdmin.client` 这类旧式客户端守卫。

### 2.2 后端（`cherry`）

- 登录/注册通过 `Set-Cookie` 下发 JWT Cookie（HttpOnly）。
- `AuthenticationContextFilter`：每请求解析 Cookie 或 `Authorization: Bearer`，写入 `UserContext`（`userId` / `isLogin`）。
- `GET /api/auth/me` 基于 `UserContext` 返回当前用户，不再在 Controller 内重复解析 Cookie。
- `POST /api/auth/logout` 清除认证 Cookie。
- `AuthorizationInterceptor` + `@RequireLogin` / `@RequireAdmin`；示例：`POST /api/submissions` 需登录。
- `UserContext.currentUser` 按需加载与缓存策略（当前仍以 `userId` 为主，实体字段可后续补全）。
- 管理类接口普遍挂载 `@RequireAdmin` 并与前端管理入口对齐。
- `POST /api/auth/forgot-password` 真实发信/重置链路（目前为占位）。

### 2.3 跨部署 / SSR / 测试（横切）

- 生产环境前后端 **同域反代或 BFF** 与 Cookie 域策略的书面约定与部署配置（文档 4.4 的落地）。
- **Refresh Token**、令牌轮换、会话撤销策略（对应需求 N5 / 计划 P3）。
- 审计、日志/Trace 中携带用户标识（隐私与脱敏，对应 P3）。
- 端到端或集成自动化测试：注册 → 登录 → `/me` → 受保护接口 401 → 登出 → 403 管理员路径等（对应第 6 节 DoD）。

## 3. 需求文档（Requirements）

## 3.1 功能需求

- `R1`：用户可通过用户名/邮箱 + 密码登录。
- `R2`：登录成功后，系统应在后续请求中识别当前用户身份。
- `R3`：前端应能在任意页面判断“已登录/未登录”并拿到当前用户信息。
- `R4`：系统应支持退出登录（清理认证 Cookie 与前端状态）。
- `R5`：受保护接口应能统一返回 401（未登录）或 403（无权限）。
- `R6`：支持普通登录权限与管理员权限扩展能力。

## 3.2 非功能需求

- `N1`：认证令牌通过 HttpOnly Cookie 承载，避免前端 JS 读取明文 Token。
- `N2`：后端认证解析逻辑必须单点统一，避免每个 Controller 重复解析 Cookie。
- `N3`：前端对认证失败应有一致交互（统一错误展示与跳转策略）。
- `N4`：兼容浏览器 CSR 与 Next SSR/BFF 的请求模式。
- `N5`：设计应可演进至 Refresh Token、审计日志和细粒度权限控制。

## 4. 设计文档（Design）

## 4.1 总体设计原则

- **认证解析后移到基础设施层**：由后端统一拦截器解析身份，业务层只读 `UserContext`。
- **前端状态为“用户信息缓存”，而非 Token 存储**：Token 始终由 Cookie 管理。
- **接口权限规则中心化**：通过注解或统一配置表达“是否需要登录/是否需要管理员”。

## 4.2 后端设计

### 4.2.1 请求级认证拦截

新增统一拦截器（建议 `OncePerRequestFilter` 或 `HandlerInterceptor`）：

1. 从请求中提取凭证（建议优先 Cookie，其次 `Authorization: Bearer`）。
2. 调用 `JwtService` 解析用户 ID。
3. 将解析结果写入 `UserContext`：
  - 有效令牌：`isLogin=true`、`userId=...`。
  - 无效/缺失：`isLogin=false`、`userId=null`（匿名请求）。
4. 业务层按需读取 `UserContext` 完成鉴权和用户获取。

### 4.2.2 接口鉴权策略

- 新增注解（建议）：
  - `@RequireLogin`
  - `@RequireAdmin`
- 在拦截器/切面中集中校验，统一抛出 401/403。
- `AuthController.me` 改为基于 `UserContext` 获取当前用户，不再重复手工解析 Cookie。

### 4.2.3 登出接口

- 新增 `POST /api/auth/logout`：
  - 后端返回清除 JWT Cookie 的响应头。
  - 前端据此清理本地用户状态并跳转到登录页。

## 4.3 前端设计（`cherry-ui`）

### 4.3.1 全局认证状态层

当前前端采用“服务端 session + 客户端快照”的组合模式：

- 服务端 layout 通过 Cookie 调 `/api/auth/me`，拿到当前用户。
- `AuthSnapshot.client.tsx` 将服务端用户快照写入 `auth.store`。
- `auth.store` 只保留：
  - `user`
  - `initialized`
  - `isAuthenticated`
  - `setUser(profile | null)`（登录/注册成功后立即同步）
  - `logout()`

`AuthProvider.client.tsx` 保留，但职责仅剩：

- 监听 `auth:unauthorized`
- 在浏览器侧清空用户快照

不再由 `AuthProvider` 主动发起 `/me` 初始化请求。

### 4.3.2 请求层统一错误处理

- 在 API 基础层统一处理 401/403：
  - 401：清空前端用户状态，按页面策略跳转 `/login`。
  - 403：提示“无权限”。

### 4.3.3 页面与路由行为

- 登录成功：
  - 保留后端下发 Cookie。
  - 同步刷新全局 `user` 状态后再跳转业务页。
- 需要登录的页面：
  - 优先在服务端页面入口或 route layout 完成重定向。
  - 客户端组件不再承担首层登录态判定。

## 4.4 部署与跨域注意事项

- 若前后端跨域部署，需确保：
  - CORS 允许凭证（`allowCredentials=true`）。
  - 前端请求使用 `credentials: "include"`。
  - Cookie 的 `SameSite` / `Secure` 与部署模型匹配。
- 若需要 SSR 代用户请求后端，需统一 Cookie 所属域或采用 BFF 代理策略。

## 5. 分阶段实施计划

### P0（优先）

- 后端：实现统一认证拦截并写入 `UserContext`。
- 后端：`/me` 改造为读取 `UserContext`。

### P1

- 前端：新增 `AuthProvider` 并在应用根布局接入。
- 前端：统一 401/403 处理。
- 后端：新增 `logout` 接口。

### P2

- 后端：落地 `@RequireLogin` / `@RequireAdmin`。
- 前端：将受保护页面与管理入口迁移到服务端权限入口。

### P3（增强）

- 令牌续期（Refresh Token）与会话策略优化。
- 审计日志、追踪信息、异常告警完善。

## 6. 验收标准（Definition of Done）

- 登录后刷新页面仍可识别登录状态。
- 未登录访问受保护接口稳定返回 401。
- 无权限访问管理员接口稳定返回 403。
- 登出后 Cookie 被清理，前端状态同步清空。
- 关键认证流程具备基础自动化测试（至少覆盖登录、`/me`、登出、401/403）。
