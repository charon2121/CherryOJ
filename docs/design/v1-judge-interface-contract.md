# CherryOJ Judge Interface Contract v1

本文档定义 `cherry-web`、`cherry-server`、`cherry-judge` 在提交判题链路上的接口边界。

V1 目标是让真实判题链路跑通：

- 浏览器只调用 `cherry-server`，不直接访问 `cherry-judge`。
- `cherry-server` 负责鉴权、落库、读取题目与测试点、派发判题任务、接收判题结果、推送前端状态。
- `cherry-judge` 只负责执行事实：编译、运行、比对、产出结果，并通过 webhook 通知 `cherry-server`。
- JSON 命名约定：浏览器 API 使用 `camelCase`；`cherry-server` 与 `cherry-judge` 之间使用 `snake_case`。
- 跨服务 ID 统一使用 string，`cherry-server` 入库前再转换为 `Long`。

## 1. 服务边界

```text
------------+        HTTP         +---------------+        HTTP         +--------------+
| cherry-web | -----------------> | cherry-server | -----------------> | cherry-judge |
|            | POST submission    |               | POST judge task    |              |
|            | SSE submission     |               |                    |              |
|            | <----------------- |               | <----------------- |              |
|            | status events      |               | judge webhook      |              |
+------------+                    +---------------+                    +--------------+
```

接口方向：

```text
cherry-web
  -> cherry-server: POST /api/submissions
  -> cherry-server: GET /api/submissions/{submissionId}
  -> cherry-server: GET /api/submissions/{submissionId}/events

cherry-server
  -> cherry-judge: POST /submissions

cherry-judge
  -> cherry-server: POST /api/internal/judge/webhook
```

`cherry-judge` 默认地址：

```text
http://127.0.0.1:6060
```

`cherry-server` 访问 judge 的建议配置：

```yaml
app:
  judge:
    enabled: true
    base-url: http://127.0.0.1:6060
    connect-timeout-ms: 2000
    dispatch-timeout-ms: 5000
    webhook-token: ${APP_JUDGE_WEBHOOK_TOKEN:dev-judge-token}
```

`poll-interval-ms` 和 `max-wait-ms` 不再用于主提交链路。提交接口必须快速返回，不等待判题完成。

## 2. 浏览器到 cherry-server

### 2.1 创建提交

```http
POST /api/submissions
Content-Type: application/json
Cookie: cherry_jwt=...
```

请求体：

```json
{
  "problemId": 1,
  "languageCode": "cpp17",
  "sourceCode": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){return 0;}\n"
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `problemId` | number | 是 | `problem.id` |
| `languageCode` | string | 是 | 用户选择的语言代码，必须存在于后端 `language.code`，且该题允许使用 |
| `sourceCode` | string | 是 | 用户源码，不能为空白字符串 |

响应体包裹在通用 `ApiResponse` 中：

```json
{
  "success": true,
  "code": 0,
  "message": "OK",
  "data": {
    "submissionId": 101,
    "status": "JUDGING",
    "resultCode": null
  },
  "timestamp": 1760000000000
}
```

语义要求：

- 后端创建提交后应尽快返回。
- 若 judge 任务派发成功，返回 `JUDGING`。
- 若 judge 未启用、连接失败、任务被拒绝，后端可以返回 `SYSTEM_ERROR`，同时必须把该提交写成终态。
- 不允许提交接口同步等待判题完成。

`data.status` 取值：

| 值 | 说明 |
| --- | --- |
| `PENDING` | 已创建，尚未派发到 judge |
| `JUDGING` | 已派发到 judge，等待 webhook |
| `FINISHED` | 判题完成 |
| `SYSTEM_ERROR` | 平台或 judge 服务异常 |
| `UNKNOWN` | 无法识别的内部状态 |

`data.resultCode` 可为空；终态取值见“判题结果取值”。

### 2.2 查询提交详情

```http
GET /api/submissions/{submissionId}
Cookie: cherry_jwt=...
```

响应体：

```json
{
  "success": true,
  "code": 0,
  "message": "OK",
  "data": {
    "id": 101,
    "userId": 7,
    "problemId": 1,
    "languageId": 1,
    "languageCode": "cpp17",
    "status": "FINISHED",
    "resultCode": "AC",
    "score": 100,
    "timeUsedMs": 4,
    "memoryUsedKb": 0,
    "codeLength": 92,
    "passedCases": 2,
    "totalCases": 2,
    "message": null,
    "judgedAt": "2026-04-21T14:10:00",
    "createdAt": "2026-04-21T14:09:58",
    "testCaseResults": [
      {
        "caseNo": 1,
        "resultCode": "AC",
        "timeUsedMs": 2,
        "memoryUsedKb": 0,
        "message": null
      }
    ]
  },
  "timestamp": 1760000000000
}
```

权限规则：

- 必须登录。
- 普通用户只能查询自己的提交。
- 不向普通用户返回隐藏测试点输入和期望输出。
- 普通用户不应看到 AC 测试点的 stdout。非 AC 的 stdout/stderr 可以作为截断后的错误摘要返回。

### 2.3 订阅提交事件

```http
GET /api/submissions/{submissionId}/events
Accept: text/event-stream
Cookie: cherry_jwt=...
```

事件格式采用 SSE。

连接建立后，后端应立即发送一次 snapshot：

```text
event: submission.snapshot
data: {"submissionId":101,"status":"JUDGING","resultCode":null}
```

状态变化事件：

```text
event: submission.updated
data: {"submissionId":101,"status":"FINISHED","resultCode":"AC","passedCases":2,"totalCases":2}
```

错误事件：

```text
event: submission.error
data: {"submissionId":101,"status":"SYSTEM_ERROR","resultCode":"SYSTEM_ERROR","message":"Judge service request failed"}
```

心跳事件：

```text
event: ping
data: {}
```

SSE 语义要求：

- 必须登录。
- 普通用户只能订阅自己的提交。
- 后端不保证事件永久保存；前端重连后应通过 `GET /api/submissions/{id}` 或 snapshot 获得最新状态。
- 收到 `FINISHED` 或 `SYSTEM_ERROR` 后，前端可以关闭 SSE，并请求提交详情补齐完整结果。

## 3. cherry-server 到 cherry-judge

### 3.1 提交判题任务

```http
POST /submissions
Content-Type: application/json
```

请求体：

```json
{
  "task_id": "101-1",
  "submission_id": "101",
  "problem_id": "1",
  "language": "cpp",
  "source_code": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){return 0;}\n",
  "limit": {
    "time_limit_ms": 1000,
    "memory_limit_kb": 262144,
    "output_limit_kb": 1024
  },
  "test_cases": [
    {
      "case_id": "10001",
      "case_no": 1,
      "input": "1 2\n",
      "expected_output": "3\n",
      "score": 50
    }
  ],
  "callback": {
    "url": "http://127.0.0.1:8080/api/internal/judge/webhook"
  }
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `task_id` | string | 是 | 判题任务 ID。建议 `${submission_id}-${attempt}`，用于幂等和重判 |
| `submission_id` | string | 是 | `submission.id` 的字符串形式 |
| `problem_id` | string | 是 | `problem.id` 的字符串形式 |
| `language` | string | 是 | judge 语言代码，v1 支持 `cpp`、`python` |
| `source_code` | string | 是 | 用户源码 |
| `limit.time_limit_ms` | number | 是 | 当前语言时间限制，毫秒 |
| `limit.memory_limit_kb` | number | 是 | 当前语言内存限制，KB，由后端 MB 转换 |
| `limit.output_limit_kb` | number | 是 | 输出限制，V1 可使用默认 1024 |
| `test_cases` | array | 是 | 需要执行的测试点，必须至少 1 个 |
| `test_cases[].case_id` | string | 是 | `test_case.id` 的字符串形式 |
| `test_cases[].case_no` | number | 是 | 测试点序号，便于 webhook 直接回写 |
| `test_cases[].input` | string | 是 | 标准输入 |
| `test_cases[].expected_output` | string | 是 | 期望输出 |
| `test_cases[].score` | number | 是 | 测试点分值；V1 后端仍可按通过比例算总分 |
| `callback.url` | string | 是 | judge 完成后回调的后端 URL |

语言映射由 `cherry-server` 完成：

| `language.code` 示例 | 发送给 judge 的 `language` |
| --- | --- |
| `cpp`、`cpp17`、`c++17` | `cpp` |
| `python`、`python3` | `python` |

成功响应：

```json
{
  "submission_id": "101",
  "task_id": "101-1",
  "status": "queued"
}
```

失败响应：

```json
{
  "error": "invalid_request",
  "message": "unsupported language: java17"
}
```

HTTP 状态：

| 状态码 | 场景 |
| --- | --- |
| `200` | 任务已入队 |
| `400` | JSON 格式错误、字段缺失、语言不支持 |
| `409` | `task_id` 已存在且已完成，judge 拒绝重复任务 |
| `503` | judge 暂不可用或队列关闭 |

## 4. cherry-judge 到 cherry-server

### 4.1 判题完成 webhook

```http
POST /api/internal/judge/webhook
Content-Type: application/json
X-Judge-Token: dev-judge-token
```

请求体：

```json
{
  "task_id": "101-1",
  "submission_id": "101",
  "status": "finished",
  "result": {
    "submission_id": "101",
    "final_verdict": "AC",
    "passed_cases": 2,
    "total_cases": 2,
    "total_time_ms": 4,
    "peak_memory_kb": 0,
    "compile_result": {
      "success": true,
      "exit_code": 0,
      "time_ms": 300,
      "memory_kb": 0,
      "stdout_text": "",
      "stderr_text": "",
      "executable_path": "/workspace/101/main.out"
    },
    "run_results": [
      {
        "case_id": "10001",
        "case_no": 1,
        "verdict": "AC",
        "exit_code": 0,
        "signal": 0,
        "time_ms": 2,
        "memory_kb": 0,
        "stdout_text": "3\n",
        "stderr_text": ""
      }
    ],
    "message": ""
  }
}
```

系统错误 webhook：

```json
{
  "task_id": "101-1",
  "submission_id": "101",
  "status": "failed",
  "error": {
    "code": "SYSTEM_ERROR",
    "message": "workspace is not writable"
  }
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `task_id` | string | 是 | 原始任务 ID |
| `submission_id` | string | 是 | 原始提交 ID |
| `status` | string | 是 | `finished` 或 `failed` |
| `result` | object | `finished` 必填 | 判题结果 |
| `error` | object | `failed` 必填 | 系统错误 |
| `result.final_verdict` | string | 是 | judge verdict，见第 5 节 |
| `result.run_results[].case_id` | string | 是 | 原始测试点 ID |
| `result.run_results[].case_no` | number | 是 | 原始测试点序号 |

后端响应：

```json
{
  "success": true,
  "code": 0,
  "message": "OK",
  "data": {
    "accepted": true
  },
  "timestamp": 1760000000000
}
```

HTTP 状态：

| 状态码 | 场景 |
| --- | --- |
| `200` | webhook 已接受；重复回调但内容一致也返回 200 |
| `400` | 请求结构非法 |
| `401` | `X-Judge-Token` 缺失或错误 |
| `404` | `submission_id` 不存在 |
| `409` | `task_id` 与当前提交不匹配，或终态内容冲突 |

幂等规则：

- 同一个 `task_id` 的重复 webhook 必须可安全重放。
- 若提交已经是 `FINISHED` 或 `SYSTEM_ERROR`，且 webhook 内容与已存结果一致，返回 200。
- 若提交已终态但 webhook 内容冲突，返回 409，并记录日志。
- 写入 `submission` 和 `submission_test_case_result` 必须在同一事务内完成。
- webhook 写库成功后再向 SSE 订阅者推送事件。

鉴权规则：

- V1 使用 `X-Judge-Token` 共享密钥。
- 后续若 judge 暴露在不可信网络，应升级为 `X-Judge-Signature: HMAC-SHA256(body)`。

## 5. 判题结果取值

`cherry-judge` 输出的 verdict：

| 值 | 含义 |
| --- | --- |
| `AC` | Accepted |
| `WA` | Wrong Answer |
| `CE` | Compilation Error |
| `RE` | Runtime Error |
| `TLE` | Time Limit Exceeded |
| `SE` | System Error |

`PENDING` 只允许作为 judge 内部中间状态，不允许出现在 `finished` webhook 的 `final_verdict` 中。

`cherry-server` 对浏览器返回时做业务化归一：

| judge verdict | browser `resultCode` |
| --- | --- |
| `AC` | `AC` |
| `WA` | `WA` |
| `CE` | `CE` |
| `RE` | `RE` |
| `TLE` | `TLE` |
| `SE` | `SYSTEM_ERROR` |
| 空值、`PENDING` 或未知值 | `SYSTEM_ERROR` |

提交生命周期状态：

| 状态 | 写入方 | 说明 |
| --- | --- | --- |
| `PENDING` | `cherry-server` | 提交已创建，尚未成功派发 |
| `JUDGING` | `cherry-server` | judge 已接受任务，等待 webhook |
| `FINISHED` | `cherry-server` | webhook 已写入业务结果 |
| `SYSTEM_ERROR` | `cherry-server` | 派发失败、webhook 系统错误、结果非法或平台异常 |

judge 任务状态：

| 状态 | 说明 |
| --- | --- |
| `queued` | judge 已接受任务 |
| `finished` | judge 已完成并回调业务结果 |
| `failed` | judge 无法完成任务并回调系统错误 |

## 6. 字段映射

### 6.1 任务派发字段

| cherry-server 来源 | judge 字段 | 说明 |
| --- | --- | --- |
| `submission.id` | `submission_id` | 转为 string |
| `submission.id` + attempt | `task_id` | V1 可用 `${submission_id}-1` |
| `problem.id` | `problem_id` | 转为 string |
| `language.code` | `language` | 后端归一为 `cpp` 或 `python` |
| `submission.source_code` | `source_code` | 原样传递 |
| `problem_language_limit.time_limit_ms` 或 `problem.default_time_limit_ms` | `limit.time_limit_ms` | 优先语言限制 |
| `problem_language_limit.memory_limit_mb` 或 `problem.default_memory_limit_mb` | `limit.memory_limit_kb` | MB * 1024 |
| 默认值 | `limit.output_limit_kb` | V1 建议 1024 |
| `test_case.id` | `test_cases[].case_id` | 转为 string |
| `test_case.case_no` | `test_cases[].case_no` | 原样传递 |
| `test_case.input_data` | `test_cases[].input` | null 按空字符串 |
| `test_case.expected_output` | `test_cases[].expected_output` | null 按空字符串 |
| `test_case.score` | `test_cases[].score` | null 按 0 |

### 6.2 总体结果字段

| webhook 字段 | cherry-server 存储 / DTO 字段 | 说明 |
| --- | --- | --- |
| `result.final_verdict` | `submission.result_code` / `resultCode` | 经 `normalizeVerdict` 归一 |
| `result.passed_cases` | `passedCases` | 查询时也可由测试点结果重新统计 |
| `result.total_cases` | `totalCases` | 查询时也可由测试点结果数量返回 |
| `result.total_time_ms` | `submission.time_used_ms` / `timeUsedMs` | 总运行时间 |
| `result.peak_memory_kb` | `submission.memory_used_kb` / `memoryUsedKb` | 峰值内存；当前 judge 可能固定为 0 |
| `result.message` 或 `error.message` | `message` | fallback 错误信息 |

### 6.3 测试点结果字段

| webhook 字段 | cherry-server 字段 | 说明 |
| --- | --- | --- |
| `run_results[].case_id` | `submission_test_case_result.test_case_id` | 用于匹配后端测试点 |
| `run_results[].case_no` | `submission_test_case_result.case_no` | 直接回写 |
| `run_results[].verdict` | `resultCode` | 经 `normalizeVerdict` 归一 |
| `run_results[].time_ms` | `timeUsedMs` | 单测试点运行时间 |
| `run_results[].memory_kb` | `memoryUsedKb` | 单测试点内存 |
| `run_results[].stderr_text` | `message` | 优先作为错误信息 |
| `run_results[].stdout_text` | `message` | 非 AC 且 stderr 为空时作为辅助信息 |

## 7. 时序约定

```text
1. cherry-web POST /api/submissions
2. cherry-server 校验用户、题目、语言、源码
3. cherry-server 创建 submission，状态 PENDING
4. cherry-server 读取 active test cases 和语言限制
5. cherry-server POST /submissions 到 cherry-judge
6. judge 返回 queued
7. cherry-server 更新 submission 为 JUDGING
8. cherry-server 返回 CreateSubmissionResponse
9. cherry-web 连接 GET /api/submissions/{id}/events
10. judge 执行任务
11. judge POST /api/internal/judge/webhook
12. cherry-server 校验 webhook，事务写入结果
13. cherry-server 推送 SSE submission.updated
14. cherry-web 收到终态后 GET /api/submissions/{id} 拉完整详情
```

派发失败处理：

```text
1. cherry-server 创建 submission，状态 PENDING
2. cherry-server 派发 judge 失败
3. cherry-server 写 submission 为 SYSTEM_ERROR
4. cherry-server 返回 CreateSubmissionResponse(status=SYSTEM_ERROR, resultCode=SYSTEM_ERROR)
```

judge 执行失败处理：

```text
1. judge 接受任务并返回 queued
2. judge 在执行前或执行中发生系统错误
3. judge POST webhook(status=failed)
4. cherry-server 写 submission 为 SYSTEM_ERROR
5. cherry-server 推送 SSE submission.error
```

## 8. 实现状态和剩余工作

已落地：

- 后端提交链路已改为异步派发 judge，不再轮询等待结果。
- `CreateSubmissionResponse` 正常返回 `JUDGING`，派发失败返回 `SYSTEM_ERROR`。
- 前端提交后通过 SSE 订阅 `/api/submissions/{id}/events`，收到终态后再拉取提交详情。
- 后端已提供 `/api/internal/judge/webhook`，使用 `X-Judge-Token` 校验 judge 回调。
- 后端已提供 `/api/submissions/{id}/events`。
- 后端派发 judge 请求已包含 `task_id`、`limit`、`callback`、`test_cases[].case_no`。
- judge 的 `Submission` 和 `JudgeTask` 已支持 `task_id`、`limit`、`callback`、`case_no`。
- 后端已将内存限制从 MB 转换为 judge 所需的 KB。
- 后端已校验题目语言限制，并在提交前拦截 judge 不支持的语言。
- 后端已把 judge `SE` 归一为浏览器侧 `SYSTEM_ERROR`。
- judge 已修复 `JudgeEngine::Aggregate` 可能返回最终 `PENDING` 的问题。
- judge 工作目录已通过 `CHERRY_JUDGE_WORKSPACE` 配置，默认 `/tmp/cherry-judge-workspace`。
- judge 已修复 stderr 重定向和 Python runner 重判源码覆盖问题。
- webhook V1 幂等已按固定 `task_id=${submission_id}-1` 与提交终态做基础处理。

仍待处理：

- judge 仍未实现真实内存统计，`memory_kb` 目前可能为 0。
- judge 仍未支持 `stackLimitMb`，V1 不声明其生效。
- 后端没有持久化 `output_limit_kb` 字段，V1 使用默认值 1024。
- 固定 `task_id=${submission_id}-1` 只能支撑首判；重判、重试和多 judge 节点需要独立 judge task 表。
- webhook 通知失败目前只保证 judge worker 不退出，尚未实现持久化重试队列。
- 当前执行环境仍不是安全沙箱，只适合本地 MVP 验证。
