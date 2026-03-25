#ifndef CHERRY_DOMAIN_COMPILE_RESULT_H_
#define CHERRY_DOMAIN_COMPILE_RESULT_H_

#include <cstdint>
#include <nlohmann/json.hpp>
#include <string>

namespace cherry::domain {
struct CompileResult {
    bool success = false;
    int exit_code = -1;
    int64_t time_ms = 0;
    int64_t memory_kb = 0;
    std::string stdout_text;
    std::string stderr_text;
    std::string executable_path;
};

inline void to_json(nlohmann::json& json, const CompileResult& result) {
    json = nlohmann::json{{"success", result.success},
                          {"exit_code", result.exit_code},
                          {"time_ms", result.time_ms},
                          {"memory_kb", result.memory_kb},
                          {"stdout_text", result.stdout_text},
                          {"stderr_text", result.stderr_text},
                          {"executable_path", result.executable_path}};
}

inline void from_json(const nlohmann::json& json, CompileResult& result) {
    json.at("success").get_to(result.success);
    json.at("exit_code").get_to(result.exit_code);
    json.at("time_ms").get_to(result.time_ms);
    json.at("memory_kb").get_to(result.memory_kb);
    json.at("stdout_text").get_to(result.stdout_text);
    json.at("stderr_text").get_to(result.stderr_text);
    json.at("executable_path").get_to(result.executable_path);
}
}  // namespace cherry::domain

#endif
