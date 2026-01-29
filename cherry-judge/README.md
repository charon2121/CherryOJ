# 代码结构图

```
cherry/
├── CMakeLists.txt
├── README.md
├── dispatcher/            # Dispatcher 进程（唯一、常驻）
│   ├── main.cpp
│   ├── Dispatcher.cpp
│   ├── Dispatcher.h
│   ├── Scheduler.cpp
│   ├── Scheduler.h
│   └── WorkerLauncher.cpp
├── worker/                # Worker 进程（一个 submission 一个）
│   ├── main.cpp
│   ├── Worker.cpp
│   ├── Worker.h
│   ├── ExecutionPlan.cpp
│   ├── ExecutionPlan.h
│   ├── ExecutionContext.cpp
│   └── ExecutionContext.h
├── sandbox/               # 受限执行能力（不含判题）
│   ├── runner/
│   │   ├── main.cpp       # sandbox-runner 的 main
│   │   ├── SandboxRunner.cpp
│   │   └── SandboxRunner.h
│   ├── seccomp/
│   │   ├── Profile.cpp
│   │   └── Profile.h
│   └── limits/
│       ├── Limits.cpp
│       └── Limits.h
├── compiler/              # 构建/编译相关
│   ├── Compiler.cpp
│   ├── Compiler.h
│   ├── strategies/
│   │   ├── CppCompiler.cpp
│   │   ├── CppCompiler.h
│   │   └── ...
│   └── Artifact.cpp
│       Artifact.h
├── execution/             # 可复用的“受控执行引擎”
│   ├── Executor.cpp
│   ├── Executor.h
│   ├── ExecuteRequest.h
│   └── ExecutionResult.h
├── judge/                 # 判题（可选层）
│   ├── Judge.cpp
│   ├── Judge.h
│   ├── policies/
│   │   ├── DiffJudge.cpp
│   │   ├── DiffJudge.h
│   │   └── ...
│   └── Verdict.h
├── language/              # Language Runtime 抽象
│   ├── LanguageRuntime.h
│   ├── LanguageRegistry.cpp
│   ├── LanguageRegistry.h
│   └── profiles/
├── config/                # 配置加载与校验
│   ├── Config.cpp
│   ├── Config.h
│   └── schema/
├── ipc/                   # 进程间通信（事件、通知）
│   ├── EventClient.cpp
│   ├── EventClient.h
│   ├── EventServer.cpp
│   └── EventServer.h
├── common/                # 纯工具 & 通用模型
│   ├── logging/
│   ├── fs/
│   ├── process/
│   ├── time/
│   └── util/

└── third_party/
    └── yaml-cpp/
```