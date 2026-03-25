#ifndef CHERRY_DOMAIN_JUDGE_RESULT_H_
#define CHERRY_DOMAIN_JUDGE_RESULT_H_

#include <cstdint>
#include <nlohmann/json.hpp>
#include <optional>
#include <string>
#include <vector>

#include "domain/compile_result.h"
#include "domain/run_result.h"
#include "domain/verdict.h"

namespace cherry::domain {
struct JudgeResult {
    std::string submission_id;
    Verdict final_verdict = Verdict::kPending;
    int passed_cases = 0;
    int total_cases = 0;
    int64_t total_time_ms = 0;
    int64_t peak_memory_kb = 0;
    std::optional<CompileResult> compile_result;
    std::vector<RunResult> run_results;
    std::string message;
};

inline void to_json(nlohmann::json& json, const JudgeResult& result) {
    json = nlohmann::json{{"submission_id", result.submission_id},
                          {"final_verdict", result.final_verdict},
                          {"passed_cases", result.passed_cases},
                          {"total_cases", result.total_cases},
                          {"total_time_ms", result.total_time_ms},
                          {"peak_memory_kb", result.peak_memory_kb},
                          {"compile_result", result.compile_result},
                          {"run_results", result.run_results},
                          {"message", result.message}};
}

inline void from_json(const nlohmann::json& json, JudgeResult& result) {
    json.at("submission_id").get_to(result.submission_id);
    json.at("final_verdict").get_to(result.final_verdict);
    json.at("passed_cases").get_to(result.passed_cases);
    json.at("total_cases").get_to(result.total_cases);
    json.at("total_time_ms").get_to(result.total_time_ms);
    json.at("peak_memory_kb").get_to(result.peak_memory_kb);
    if (json.contains("compile_result") &&
        !json.at("compile_result").is_null()) {
        result.compile_result = json.at("compile_result").get<CompileResult>();
    } else {
        result.compile_result = std::nullopt;
    }
    json.at("run_results").get_to(result.run_results);
    json.at("message").get_to(result.message);
}
}  // namespace cherry::domain

#endif
