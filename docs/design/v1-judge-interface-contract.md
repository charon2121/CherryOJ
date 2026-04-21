# CherryOJ Judge Interface Contract v1

本文档定义 `cherry-web`、`cherry`、`cherry-judge` 在提交判题链路上的接口边界。

当前约定：

- 浏览器只调用 `cherry` 的 `/api/submissions`。
- `cherry` 负责鉴权、落库、读取题目与测试点、调用 `cherry-judge`、回写提交结果。
- `cherry-judge` 不直接访问主库，不暴露给浏览器，只返回执行事实。
- JSON 命名约定：`cherry` 对浏览器使用 `camelCase`；`cherry` 对 `cherry-judge` 使用 `snake_case`。

## 1. 服务边界

```text
cherry-web
  -> cherry: POST /api/submissions
  -> cherry: GET /api/submissions/{submissionId}

cherry
  -> cherry-judge: POST /submissions
  -> cherry-judge: GET /submissions/{submissionId}
```

`cherry-judge` 默认地址：

```text
http://127.0.0.1:6060
```

`cherry` 通过以下配置访问 judge：

```yaml
app:
  judge:
    enabled: true
    base-url: http://127.0.0.1:6060
    connect-timeout-ms: 2000
    poll-interval-ms: 200
    max-wait-ms: 15000
```

## 2. 浏览器到 cherry

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
| `languageCode` | string | 是 | 用户选择的语言代码，必须存在于后端 `language.code` |
| `sourceCode` | string | 是 | 用户源码，不能为空白字符串 |

响应体包裹在通用 `ApiResponse` 中：

```json
{
  "success": true,
  "code": 0,
  "message": "OK",
  "data": {
    "submissionId": 101,
    "status": "FINISHED",
    "resultCode": "AC"
  },
  "timestamp": 1760000000000
}
```

`data.status` 取值：

| 值 | 说明 |
| --- | --- |
| `PENDING` | 已创建，尚未进入判题 |
| `JUDGING` | 已发送到 judge 或正在判题 |
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

## 3. cherry 到 cherry-judge

### 3.1 提交判题任务

```http
POST /submissions
Content-Type: application/json
```

请求体：

```json
{
  "submission_id": "101",
  "problem_id": "1",
  "language": "cpp",
  "source_code": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){return 0;}\n",
  "test_cases": [
    {
      "case_id": "10001",
      "input": "1 2\n",
      "expected_output": "3\n",
      "score": 50
    }
  ]
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `submission_id` | string | 是 | `submission.id` 的字符串形式 |
| `problem_id` | string | 是 | `problem.id` 的字符串形式 |
| `language` | string | 是 | judge 语言代码，v1 支持 `cpp`、`python` |
| `source_code` | string | 是 | 用户源码 |
| `test_cases` | array | 是 | 需要执行的测试点 |
| `test_cases[].case_id` | string | 是 | `test_case.id` 的字符串形式 |
| `test_cases[].input` | string | 是 | 标准输入 |
| `test_cases[].expected_output` | string | 是 | 期望输出 |
| `test_cases[].score` | number | 是 | 测试点分值；当前后端按通过比例算总分，暂不按该字段加权 |

语言映射由 `cherry` 完成：

| `language.code` 示例 | 发送给 judge 的 `language` |
| --- | --- |
| `cpp`、`cpp17`、`c++17` | `cpp` |
| `python`、`python3` | `python` |

成功响应：

```json
{
  "submission_id": "101",
  "task_id": "101-task",
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

### 3.2 查询 judge 任务状态

```http
GET /submissions/{submissionId}
```

排队中响应：

```json
{
  "submission_id": "101",
  "status": "queued"
}
```

完成响应：

```json
{
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

不存在响应：

```json
{
  "error": "not_found",
  "message": "submission not found"
}
```

HTTP 状态：

| 状态码 | 场景 |
| --- | --- |
| `200` | 找到提交，返回 `queued` 或 `finished` |
| `404` | `submission_id` 不存在 |

## 4. 判题结果取值

`cherry-judge` 输出的 verdict：

| 值 | 含义 |
| --- | --- |
| `PENDING` | 待判定；不应作为最终成功响应返回给业务端 |
| `AC` | Accepted |
| `WA` | Wrong Answer |
| `CE` | Compilation Error |
| `RE` | Runtime Error |
| `TLE` | Time Limit Exceeded |
| `SE` | System Error |

`cherry` 对浏览器返回时做一次业务化归一：

| judge verdict | browser `resultCode` |
| --- | --- |
| `AC` | `AC` |
| `WA` | `WA` |
| `CE` | `CE` |
| `RE` | `RE` |
| `TLE` | `TLE` |
| `SE` | `SYSTEM_ERROR` |
| 空值或未知值 | `SYSTEM_ERROR` |

## 5. 字段映射

### 5.1 总体结果

| judge 字段 | cherry 存储 / DTO 字段 | 说明 |
| --- | --- | --- |
| `result.final_verdict` | `submission.result_code` / `resultCode` | 经 `normalizeVerdict` 归一 |
| `result.passed_cases` | `passedCases` | 当前查询时按测试点结果重新统计 |
| `result.total_cases` | `totalCases` | 当前查询时按测试点结果数量返回 |
| `result.total_time_ms` | `submission.time_used_ms` / `timeUsedMs` | 总运行时间 |
| `result.peak_memory_kb` | `submission.memory_used_kb` / `memoryUsedKb` | 峰值内存；当前 judge 固定为 0 |
| `result.message` | `message` | fallback 错误信息 |

### 5.2 测试点结果

| judge 字段 | cherry 字段 | 说明 |
| --- | --- | --- |
| `run_results[].case_id` | `submission_test_case_result.test_case_id` | 用于匹配后端测试点 |
| `run_results[].verdict` | `resultCode` | 经 `normalizeVerdict` 归一 |
| `run_results[].time_ms` | `timeUsedMs` | 单测试点运行时间 |
| `run_results[].memory_kb` | `memoryUsedKb` | 单测试点内存 |
| `run_results[].stderr_text` | `message` | 优先作为错误信息 |
| `run_results[].stdout_text` | `message` | 非 AC 且 stderr 为空时作为辅助信息 |

## 6. 时序约定

当前 `cherry` 采用同步提交 + 短轮询 judge 的方式：

```text
1. cherry-web POST /api/submissions
2. cherry 创建 submission，状态 PENDING
3. cherry 读取 active test cases
4. cherry 更新 submission 为 JUDGING
5. cherry POST /submissions 到 cherry-judge
6. cherry 按 poll-interval-ms 轮询 GET /submissions/{id}
7. judge 返回 finished 后，cherry 写入 submission 和 submission_test_case_result
8. cherry-web 获得 CreateSubmissionResponse，再按需 GET /api/submissions/{id}
```

如果 judge 超时、拒绝请求、连接失败或响应无法解析，`cherry` 必须把提交终态写为 `SYSTEM_ERROR`，并为测试点写入错误信息。

## 7. 当前实现差异和后续修正

以下是 v1 契约与当前实现需要注意的差异：

- `cherry-judge` 当前监听 `6060`；`cherry` 配置必须使用 `APP_JUDGE_BASE_URL=http://127.0.0.1:6060` 或等价配置。
- `ResourceLimit` 已在 judge domain 中定义，但当前 `cherry` 还没有把题目/语言限制传给 judge，runner 使用构造时写死的 timeout。
- `cherry-judge` 当前只支持 `cpp` 和 `python`；前端可展示更多语言，但后端提交到 judge 前必须拦截不支持的语言。
- `memory_kb` 当前由 judge 返回 `0`，还不是实际内存峰值。
- `stdout_text`、`stderr_text` 当前可能包含隐藏测试点输出；`cherry` 不应把 AC 的 stdout 暴露给普通用户。
- `final_verdict` 不应返回 `PENDING` 作为 finished 结果；如果出现，`cherry` 应归一为 `SYSTEM_ERROR`，judge 侧也需要修复聚合逻辑。

