# 代码结构图

```
cherry-judge/
└── src/
    ├── CMakeLists.txt
    │
    ├── cmd/
    │   └── gateway_main.cc
    │
    ├── api/
    │   ├── http_server.h
    │   ├── http_server.cc
    │   ├── submit_handler.h
    │   ├── submit_handler.cc
    │   ├── result_handler.h
    │   └── result_handler.cc
    │
    ├── app/
    │   ├── submission_service.h
    │   ├── submission_service.cc
    │   ├── judge_pipeline.h
    │   └── judge_pipeline.cc
    │
    ├── domain/
    │   ├── language.h
    │   ├── verdict.h
    │   ├── submission.h
    │   ├── test_case.h
    │   ├── judge_task.h
    │   ├── compile_result.h
    │   ├── run_result.h
    │   └── judge_result.h
    │
    ├── execution/
    │   ├── compiler.h
    │   ├── cpp_compiler.h
    │   ├── cpp_compiler.cc
    │   ├── runner.h
    │   ├── cpp_runner.h
    │   ├── cpp_runner.cc
    │   ├── python_runner.h
    │   ├── python_runner.cc
    │   ├── process_executor.h
    │   └── process_executor.cc
    │
    ├── judge/
    │   ├── output_checker.h
    │   ├── exact_match_checker.h
    │   ├── exact_match_checker.cc
    │   ├── judge_engine.h
    │   └── judge_engine.cc
    │
    ├── queue/
    │   ├── task_queue.h
    │   ├── in_memory_task_queue.h
    │   └── in_memory_task_queue.cc
    │
    ├── store/
    │   ├── submission_store.h
    │   ├── in_memory_submission_store.h
    │   ├── in_memory_submission_store.cc
    │   ├── result_store.h
    │   ├── in_memory_result_store.h
    │   └── in_memory_result_store.cc
    │
    ├── infra/
    │   ├── workspace_manager.h
    │   ├── workspace_manager.cc
    │   ├── config.h
    │   └── logger.h
    │
    └── tests/
        ├── submission_service_test.cc
        ├── cpp_compiler_test.cc
        ├── python_runner_test.cc
        ├── judge_engine_test.cc
        └── mvp_integration_test.cc
```

cmd/
gateway_main.cc：程序入口，初始化依赖，启动 HTTP server。

api/
http_server.*：HTTP 框架封装（注册路由、启动停止）。

submit_handler.*：POST /submissions，参数校验并调用 app 层。

result_handler.*：GET /submissions/{id}，返回状态/结果。

app/
submission_service.*：接收提交、生成 submission_id、入队。

judge_pipeline.*：从任务到结果的主流程编排（compile/run/judge/store）。

domain/
language.h：仅定义支持语言（kCpp, kPython）。

verdict.h：AC/WA/CE/RE/TLE 等枚举。

submission.h：用户提交实体。

test_case.h：输入/期望输出结构。

judge_task.h：执行任务结构（语言/代码/限制/测试点）。

compile_result.h / run_result.h / judge_result.h：各阶段输出模型。

execution/
compiler.h：编译接口抽象。

cpp_compiler.*：C++ 编译实现（g++）。

runner.h：运行接口抽象。

cpp_runner.*：运行编译产物。

python_runner.*：直接 python 解释执行。

process_executor.*：统一子进程执行、超时控制、stdout/stderr 收集。

judge/
output_checker.h：判题器接口。

exact_match_checker.*：严格输出一致判题。

judge_engine.*：多 test case 聚合，生成最终 verdict。

queue/
task_queue.h：队列接口。

in_memory_task_queue.*：MVP 阶段内存队列实现。

store/
submission_store.h/result_store.h：存储接口。

in_memory_*_store.*：MVP 内存存储实现（后续可替换 DB）。

infra/
workspace_manager.*：代码文件、临时目录、输出文件路径管理。

config.h：系统配置结构。

logger.h：日志统一宏/封装（后续可替换 spdlog）。

tests/
单测：编译器/runner/judge/store

src/CMakeLists.txt 只新增 add_subdirectory(mvp)，并逐步切流

文件命名统一（Google 风格）

责任单一，边界清晰

以后加沙箱/多进程时，不需要推翻 domain/app 层
