#include "compiler/compile_executor.h"

#include <string>

namespace cherry::v2::compiler {

model::CompileResult MockCompileExecutor::Compile(const model::JudgeTask& task) {
    model::CompileResult result;
    result.elapsed_ms = 10;
    if (task.source_code.find("COMPILE_ERROR") != std::string::npos) {
        result.ok = false;
        result.exit_code = 1;
        result.stderr_text = "mock compile error";
        return result;
    }
    result.ok = true;
    result.exit_code = 0;
    result.binary_path = "/tmp/mock-binary";
    return result;
}

}  // namespace cherry::v2::compiler
