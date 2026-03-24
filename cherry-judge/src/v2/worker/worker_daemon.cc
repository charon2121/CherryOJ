#include "worker/worker_daemon.h"

namespace cherry::v2::worker {

WorkerDaemon::WorkerDaemon(std::shared_ptr<compiler::CompileExecutor> compile_executor,
                           std::shared_ptr<runner::RunExecutor> run_executor,
                           std::shared_ptr<judge::JudgeEngine> judge_engine)
    : compile_executor_(std::move(compile_executor)),
      run_executor_(std::move(run_executor)),
      judge_engine_(std::move(judge_engine)) {}

WorkerDaemon::~WorkerDaemon() { Stop(); }

void WorkerDaemon::Start() {
    if (running_.exchange(true)) return;
    loop_thread_ = std::thread(&WorkerDaemon::MainLoop, this);
}

void WorkerDaemon::Stop() {
    if (!running_.exchange(false)) return;
    queue_.Close();
    if (loop_thread_.joinable()) loop_thread_.join();
}

bool WorkerDaemon::Submit(const model::JudgeTask& task) { return queue_.Push(task); }

void WorkerDaemon::SetResultCallback(ResultCallback cb) { result_callback_ = std::move(cb); }

void WorkerDaemon::MainLoop() {
    while (running_) {
        auto task = queue_.PopBlocking();
        if (!task.has_value()) {
            if (!running_) break;
            continue;
        }
        auto result = ExecuteTask(task.value());
        if (result_callback_) result_callback_(result);
    }
}

model::JudgeResult WorkerDaemon::ExecuteTask(const model::JudgeTask& task) {
    model::JudgeResult result;
    result.task_id = task.task_id;
    result.submission_id = task.submission_id;

    auto compile = compile_executor_->Compile(task);
    result.compile = compile;
    if (!compile.ok) {
        result.final_verdict = model::Verdict::kCompilationError;
        return result;
    }

    for (const auto& tc : task.testcases) {
        auto run_result = run_executor_->RunCase(task, compile, tc);
        run_result.verdict = judge_engine_->JudgeCase(run_result, tc);
        result.case_results.push_back(run_result);
    }
    judge_engine_->Aggregate(result);
    return result;
}

}  // namespace cherry::v2::worker
