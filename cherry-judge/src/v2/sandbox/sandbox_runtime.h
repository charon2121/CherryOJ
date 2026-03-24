#pragma once

#include <optional>
#include <string>
#include <vector>

#include "model/types.h"

namespace cherry::v2::sandbox {

struct SandboxProcessSpec {
    std::string executable;
    std::vector<std::string> argv;
    std::string cwd;
    model::ResourceLimits limits;
};

struct SandboxRunStats {
    int exit_code = -1;
    int term_signal = 0;
    int64_t time_ms = 0;
    int64_t memory_kb = 0;
};

class SandboxRuntime {
   public:
    virtual ~SandboxRuntime() = default;
    virtual std::optional<SandboxRunStats> Run(const SandboxProcessSpec& spec) = 0;
};

}  // namespace cherry::v2::sandbox
