#ifndef CHERRY_DOMAIN_JUDGE_TASK_H_
#define CHERRY_DOMAIN_JUDGE_TASK_H_

#include <cstdint>
#include <nlohmann/json.hpp>
#include <string>
#include <vector>

#include "domain/language.h"
#include "domain/test_case.h"

namespace cherry::domain {

struct ResourceLimit {
    int64_t time_limit_ms = 1000;
    int64_t memory_limit_kb = 262144;
    int64_t output_limit_kb = 1024;
};

inline void to_json(nlohmann::json& json, const ResourceLimit& limit) {
    json = nlohmann::json{{"time_limit_ms", limit.time_limit_ms},
                          {"memory_limit_kb", limit.memory_limit_kb},
                          {"output_limit_kb", limit.output_limit_kb}};
}

inline void from_json(const nlohmann::json& json, ResourceLimit& limit) {
    json.at("time_limit_ms").get_to(limit.time_limit_ms);
    json.at("memory_limit_kb").get_to(limit.memory_limit_kb);
    json.at("output_limit_kb").get_to(limit.output_limit_kb);
}

struct JudgeTask {
    std::string task_id;
    std::string submission_id;
    std::string problem_id;
    Language language = Language::kCpp;
    std::string source_code;
    ResourceLimit limit;
    std::vector<TestCase> test_cases;
    std::string callback_url;
};

inline void to_json(nlohmann::json& json, const JudgeTask& task) {
    json = nlohmann::json{{"task_id", task.task_id},
                          {"submission_id", task.submission_id},
                          {"problem_id", task.problem_id},
                          {"language", task.language},
                          {"source_code", task.source_code},
                          {"limit", task.limit},
                          {"test_cases", task.test_cases},
                          {"callback", {{"url", task.callback_url}}}};
}

inline void from_json(const nlohmann::json& json, JudgeTask& task) {
    json.at("task_id").get_to(task.task_id);
    json.at("submission_id").get_to(task.submission_id);
    json.at("problem_id").get_to(task.problem_id);
    json.at("language").get_to(task.language);
    json.at("source_code").get_to(task.source_code);
    json.at("limit").get_to(task.limit);
    json.at("test_cases").get_to(task.test_cases);
    if (json.contains("callback") && json.at("callback").contains("url") &&
        !json.at("callback").at("url").is_null()) {
        json.at("callback").at("url").get_to(task.callback_url);
    }
}

}  // namespace cherry::domain

#endif
