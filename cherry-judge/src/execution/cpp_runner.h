#ifndef CHERRY_EXECUTION_CPP_RUNNER_H_
#define CHERRY_EXECUTION_CPP_RUNNER_H_

#include <cstdint>

#include "execution/runner.h"
#include "infra/process_executor.h"

namespace cherry::execution {

class CppRunner final : public Runner {
   public:
    explicit CppRunner(infra::ProcessExecutor process_executor,
                       int64_t run_timeout_ms);

    domain::RunResult Run(
        const domain::JudgeTask& task, const domain::TestCase& test_case,
        const domain::CompileResult* compile_result) const override;

   private:
    infra::ProcessExecutor process_executor_;
    int64_t run_timeout_ms_;
};

}  // namespace cherry::execution

#endif
