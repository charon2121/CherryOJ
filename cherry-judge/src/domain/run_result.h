#ifndef CHERRY_DOMAIN_RUN_RESULT_H_
#define CHERRY_DOMAIN_RUN_RESULT_H_

#include <cstdint>
#include <nlohmann/json.hpp>
#include <string>

#include "domain/verdict.h"

namespace cherry::domain {

struct RunResult {
    std::string case_id;
    int case_no = 0;
    Verdict verdict = Verdict::kPending;
    int exit_code = -1;
    int signal = 0;
    int64_t time_ms = 0;
    int64_t memory_kb = 0;
    std::string stdout_text;
    std::string stderr_text;
};

inline void to_json(nlohmann::json& json, const RunResult& result) {
    json = nlohmann::json{{"case_id", result.case_id},
                          {"case_no", result.case_no},
                          {"verdict", result.verdict},
                          {"exit_code", result.exit_code},
                          {"signal", result.signal},
                          {"time_ms", result.time_ms},
                          {"memory_kb", result.memory_kb},
                          {"stdout_text", result.stdout_text},
                          {"stderr_text", result.stderr_text}};
}

inline void from_json(const nlohmann::json& json, RunResult& result) {
    json.at("case_id").get_to(result.case_id);
    if (json.contains("case_no") && !json.at("case_no").is_null()) {
        json.at("case_no").get_to(result.case_no);
    }
    json.at("verdict").get_to(result.verdict);
    json.at("exit_code").get_to(result.exit_code);
    json.at("signal").get_to(result.signal);
    json.at("time_ms").get_to(result.time_ms);
    json.at("memory_kb").get_to(result.memory_kb);
    json.at("stdout_text").get_to(result.stdout_text);
    json.at("stderr_text").get_to(result.stderr_text);
}

}  // namespace cherry::domain

#endif
