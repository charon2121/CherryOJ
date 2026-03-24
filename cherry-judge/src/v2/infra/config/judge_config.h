#pragma once

#include <string>

namespace cherry::v2::infra::config {

struct JudgeConfig {
    std::string listen_host = "0.0.0.0";
    int listen_port = 6060;
    int worker_slots = 2;
    std::string work_root = "/tmp/cherry-judge";
    int default_time_limit_ms = 1000;
    int default_memory_limit_mb = 256;
    int default_output_limit_kb = 1024;
};

}  // namespace cherry::v2::infra::config
