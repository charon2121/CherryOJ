#ifndef CHERRY_INFRA_PROCESS_EXECUTOR_H_
#define CHERRY_INFRA_PROCESS_EXECUTOR_H_

#include <cstdint>
#include <string>
#include <vector>

namespace cherry::infra {

struct ProcessResult {
    int exit_code = -1;
    int term_signal = 0;
    bool timed_out = false;
    int64_t elapsed_ms = 0;
    std::string stdout_text;
    std::string stderr_text;
};

class ProcessExecutor {
   public:
    ProcessResult Run(const std::vector<std::string>& argv,
                      const std::string& stdin_data, int64_t timeout_ms,
                      const std::string& working_path = "") const;
};

}  // namespace cherry::infra

#endif
