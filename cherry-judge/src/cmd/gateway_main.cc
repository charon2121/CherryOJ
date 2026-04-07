#include <memory>

#include "api/http_server.h"
#include "app/judge_pipeline.h"
#include "app/submission_service.h"
#include "app/task_service.h"
#include "execution/cpp_compiler.h"
#include "execution/cpp_runner.h"
#include "execution/python_runner.h"
#include "infra/process_executor.h"
#include "infra/workspace_manager.h"
#include "judge/exact_match_checker.h"
#include "judge/judge_engine.h"
#include "queue/in_memory_task_queue.h"
#include "store/in_memory_result_store.h"
#include "store/in_memory_submission_store.h"

int main(int argc, char* argv[]) {
    using namespace cherry;

    store::InMemorySubmissionStore submission_store;
    store::InMemoryResultStore result_store;
    queue::InMemoryTaskQueue task_queue;

    infra::WorkspaceManager workspace_manager("/home/ubuntu/cherry/workspace");
    infra::ProcessExecutor process_executor;

    execution::CppCompiler cpp_compiler(workspace_manager, process_executor,
                                        10000);
    execution::CppRunner cpp_runner(process_executor, 2000);
    execution::PythonRunner python_runner(workspace_manager, process_executor,
                                          2000);

    auto checker = std::make_shared<judge::ExactMatchChecker>();
    judge::JudgeEngine judge_engine(checker);

    app::JudgePipeline pipeline(&cpp_compiler, &cpp_runner, &python_runner,
                                &judge_engine, &result_store);
    app::TaskService task_service(&task_queue, &pipeline);
    app::SubmissionService submission_service(&submission_store, &task_queue);

    api::HttpServer server(&submission_service, &submission_store,
                           &result_store);

    task_service.Start();
    server.Start("0.0.0.0", 6060);
    task_service.Stop();

    return 0;
}
