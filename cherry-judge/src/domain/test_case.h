#ifndef CHERRY_DOMAIN_TEST_CASE_H_
#define CHERRY_DOMAIN_TEST_CASE_H_

#include <nlohmann/json.hpp>
#include <string>

namespace cherry::domain {

struct TestCase {
    std::string case_id;
    int case_no = 0;
    std::string input;
    std::string expected_output;
    int score = 0;
};

inline void to_json(nlohmann::json& json, const TestCase& test_case) {
    json = nlohmann::json{{"case_id", test_case.case_id},
                          {"case_no", test_case.case_no},
                          {"input", test_case.input},
                          {"expected_output", test_case.expected_output},
                          {"score", test_case.score}};
}

inline void from_json(const nlohmann::json& json, TestCase& test_case) {
    json.at("case_id").get_to(test_case.case_id);
    if (json.contains("case_no") && !json.at("case_no").is_null()) {
        json.at("case_no").get_to(test_case.case_no);
    }
    json.at("input").get_to(test_case.input);
    json.at("expected_output").get_to(test_case.expected_output);
    json.at("score").get_to(test_case.score);
}

}  // namespace cherry::domain

#endif
