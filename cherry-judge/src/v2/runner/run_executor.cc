#include "runner/run_executor.h"

namespace cherry::v2::runner {

model::RunResult MockRunExecutor::RunCase(const model::JudgeTask&, const model::CompileResult&,
                                          const model::TestCaseSpec& tc) {
    model::RunResult r;
    r.case_id = tc.case_id;
    r.stdout_text = tc.input;  // mock: echo input
    r.time_ms = 5;
    r.memory_kb = 1024;
    r.exit_code = 0;
    r.term_signal = 0;
    r.verdict = model::Verdict::kPending;
    return r;
}

}  // namespace cherry::v2::runner
