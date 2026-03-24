#include <iostream>
#include <memory>
#include <thread>

#include "api/judge_service.h"
#include "compiler/compile_executor.h"
#include "judge/judge_engine.h"
#include "queue/in_memory_task_queue.h"
#include "scheduler/scheduler.h"
#include "worker/worker_daemon.h"

using namespace cherry::v2;

int main() {
    auto queue = std::make_shared<queue::InMemoryTaskQueue>();
    auto compiler = std::make_shared<compiler::MockCompileExecutor>();
    auto runner = std::make_shared<runner::MockRunExecutor>();
    auto judge_engine = std::make_shared<judge::ExactMatchJudgeEngine>();

    auto worker = std::make_shared<worker::WorkerDaemon>(compiler, runner, judge_engine);
    api::JudgeService service(queue);

    worker->SetResultCallback([&service](const model::JudgeResult& result) {
        service.SaveResult(result);
        std::cout << "Result saved for submission=" << result.submission_id << std::endl;
    });

    scheduler::Scheduler scheduler(queue, worker);
    worker->Start();
    scheduler.Start();

    model::JudgeTask task;
    task.submission_id = "s-1";
    task.problem_id = "p-1";
    task.source_code = "int main(){return 0;}";
    task.testcases.push_back({"1", "hello", "hello", 1});

    service.Submit(task);

    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    auto result = service.GetResult("s-1");
    if (result.has_value()) {
        std::cout << "Final verdict=" << static_cast<int>(result->final_verdict)
                  << " passed=" << result->passed_cases << "/" << result->total_cases << std::endl;
    } else {
        std::cout << "Result not ready" << std::endl;
    }

    scheduler.Stop();
    queue->Close();
    worker->Stop();

    return 0;
}
