#pragma once

#include <atomic>
#include <functional>
#include <memory>
#include <thread>

#include "compiler/compile_executor.h"
#include "judge/judge_engine.h"
#include "queue/in_memory_task_queue.h"
#include "runner/run_executor.h"
#include "worker/worker_client.h"

namespace cherry::v2::worker {

class WorkerDaemon final : public WorkerClient {
   public:
    using ResultCallback = std::function<void(const model::JudgeResult&)>;

    WorkerDaemon(std::shared_ptr<compiler::CompileExecutor> compile_executor,
                 std::shared_ptr<runner::RunExecutor> run_executor,
                 std::shared_ptr<judge::JudgeEngine> judge_engine);
    ~WorkerDaemon();

    void Start();
    void Stop();

    bool Submit(const model::JudgeTask& task) override;
    void SetResultCallback(ResultCallback cb);

   private:
    void MainLoop();
    model::JudgeResult ExecuteTask(const model::JudgeTask& task);

   private:
    std::shared_ptr<compiler::CompileExecutor> compile_executor_;
    std::shared_ptr<runner::RunExecutor> run_executor_;
    std::shared_ptr<judge::JudgeEngine> judge_engine_;

    queue::InMemoryTaskQueue queue_;
    std::atomic<bool> running_{false};
    std::thread loop_thread_;
    ResultCallback result_callback_;
};

}  // namespace cherry::v2::worker
