#ifndef CHERRY_EXECUTION_CPP_COMPILER_H_
#define CHERRY_EXECUTION_CPP_COMPILER_H_

#include <cstdint>

#include "execution/compiler.h"
#include "infra/process_executor.h"
#include "infra/workspace_manager.h"

namespace cherry::execution {
class CppCompiler final : public Compiler {
   public:
    CppCompiler(infra::WorkspaceManager workspace_manager,
                infra::ProcessExecutor process_executor,
                int64_t compile_timeout_ms = 5000);

    domain::CompileResult Compile(const domain::JudgeTask& task) const override;

   private:
    infra::WorkspaceManager workspace_manager_;
    infra::ProcessExecutor process_executor_;
    int64_t compile_timeout_ms_;
};
}  // namespace cherry::execution

#endif
