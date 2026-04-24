#ifndef CHERRY_DOMAIN_SUBMISSION_H_
#define CHERRY_DOMAIN_SUBMISSION_H_

#include <string>
#include <vector>

#include "domain/judge_task.h"
#include "domain/language.h"
#include "domain/test_case.h"

namespace cherry::domain {

struct Submission {
    std::string task_id;
    std::string submission_id;
    std::string problem_id;
    Language language = Language::kCpp;
    std::string source_code;
    ResourceLimit limit;
    std::vector<TestCase> test_cases;
    std::string callback_url;
};

inline void to_json(nlohmann::json& json, const Submission& submission) {
    json = nlohmann::json{{"task_id", submission.task_id},
                          {"submission_id", submission.submission_id},
                          {"problem_id", submission.problem_id},
                          {"language", submission.language},
                          {"source_code", submission.source_code},
                          {"limit", submission.limit},
                          {"test_cases", submission.test_cases},
                          {"callback", {{"url", submission.callback_url}}}};
}

inline void from_json(const nlohmann::json& json, Submission& submission) {
    if (json.contains("task_id") && !json.at("task_id").is_null()) {
        json.at("task_id").get_to(submission.task_id);
    }
    json.at("submission_id").get_to(submission.submission_id);
    json.at("problem_id").get_to(submission.problem_id);
    json.at("language").get_to(submission.language);
    json.at("source_code").get_to(submission.source_code);
    if (json.contains("limit") && !json.at("limit").is_null()) {
        json.at("limit").get_to(submission.limit);
    }
    json.at("test_cases").get_to(submission.test_cases);
    if (json.contains("callback") && json.at("callback").contains("url") &&
        !json.at("callback").at("url").is_null()) {
        json.at("callback").at("url").get_to(submission.callback_url);
    }
}

}  // namespace cherry::domain

#endif
