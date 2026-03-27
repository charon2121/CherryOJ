#ifndef CHERRY_EXECUTION_PYTHON_RUNNER_H_
#define CHERRY_EXECUTION_PYTHON_RUNNER_H_

#include <cstdint>

#include "execution/runner.h"
#include "infra/process_executor.h"
#include "infra/workspace_manager.h"

namespace cherry::execution {
class PythonRunner final : public Runner {
   public:
    PythonRunner(infra::WorkspaceManager workspace_manager,
                 infra::ProcessExecutor process_executor,
                 int64_t run_timeout_ms = 2000);

    domain::RunResult Run(
        const domain::JudgeTask& task, const domain::TestCase& test_case,
        const domain::CompileResult* compile_result) const override;

   private:
    infra::WorkspaceManager workspace_manager_;
    infra::ProcessExecutor process_executor_;
    int64_t run_timeout_ms_;
};
}  // namespace cherry::execution

#endif