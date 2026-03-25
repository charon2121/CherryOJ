#ifndef CHERRY_DOMAIN_SUBMISSION_H_
#define CHERRY_DOMAIN_SUBMISSION_H_

#include <string>
#include <vector>

#include "domain/language.h"
#include "domain/test_case.h"

namespace cherry::domain {

struct Submission {
    std::string submission_id;
    std::string problem_id;
    Language language = Language::kCpp;
    std::string source_code;
    std::vector<TestCase> test_cases;
};

inline void to_json(nlohmann::json& json, const Submission& submission) {
    json = nlohmann::json{{"submission_id", submission.submission_id},
                          {"problem_id", submission.problem_id},
                          {"language", submission.language},
                          {"source_code", submission.source_code},
                          {"test_cases", submission.test_cases}};
}

inline void from_json(const nlohmann::json& json, Submission& submission) {
    json.at("submission_id").get_to(submission.submission_id);
    json.at("problem_id").get_to(submission.problem_id);
    json.at("language").get_to(submission.language);
    json.at("source_code").get_to(submission.source_code);
    json.at("test_cases").get_to(submission.test_cases);
}

}  // namespace cherry::domain

#endif