#include "result.h"

// 状态映射：JudgeStatus -> 字符串
static const std::unordered_map<JudgeStatus, std::string> status_to_str = {
    {JudgeStatus::WAITING_0, "WAITING_0"},
    {JudgeStatus::WAITING_1, "WAITING_1"},
    {JudgeStatus::COMPILING, "COMPILING"},
    {JudgeStatus::RUNNING, "RUNNING"},
    {JudgeStatus::ACCEPTED, "ACCEPTED"},
    {JudgeStatus::PRESENTATION_ERROR, "PRESENTATION_ERROR"},
    {JudgeStatus::WRONG_ANSWER, "WRONG_ANSWER"},
    {JudgeStatus::TIME_LIMIT_EXCEEDED, "TIME_LIMIT_EXCEEDED"},
    {JudgeStatus::MEMORY_LIMIT_EXCEEDED, "MEMORY_LIMIT_EXCEEDED"},
    {JudgeStatus::OUTPUT_LIMIT_EXCEEDED, "OUTPUT_LIMIT_EXCEEDED"},
    {JudgeStatus::RUNTIME_ERROR, "RUNTIME_ERROR"},
    {JudgeStatus::COMPILATION_ERROR, "COMPILATION_ERROR"},
    {JudgeStatus::CONTACT_ADMIN, "CONTACT_ADMIN"},
    {JudgeStatus::TESTING_REJUDGE, "TESTING_REJUDGE"}};

// 状态映射：字符串 -> JudgeStatus
static const std::unordered_map<std::string, JudgeStatus> str_to_status = {
    {"WAITING_0", JudgeStatus::WAITING_0},
    {"WAITING_1", JudgeStatus::WAITING_1},
    {"COMPILING", JudgeStatus::COMPILING},
    {"RUNNING", JudgeStatus::RUNNING},
    {"ACCEPTED", JudgeStatus::ACCEPTED},
    {"PRESENTATION_ERROR", JudgeStatus::PRESENTATION_ERROR},
    {"WRONG_ANSWER", JudgeStatus::WRONG_ANSWER},
    {"TIME_LIMIT_EXCEEDED", JudgeStatus::TIME_LIMIT_EXCEEDED},
    {"MEMORY_LIMIT_EXCEEDED", JudgeStatus::MEMORY_LIMIT_EXCEEDED},
    {"OUTPUT_LIMIT_EXCEEDED", JudgeStatus::OUTPUT_LIMIT_EXCEEDED},
    {"RUNTIME_ERROR", JudgeStatus::RUNTIME_ERROR},
    {"COMPILATION_ERROR", JudgeStatus::COMPILATION_ERROR},
    {"CONTACT_ADMIN", JudgeStatus::CONTACT_ADMIN},
    {"TESTING_REJUDGE", JudgeStatus::TESTING_REJUDGE}};

// 将 JudgeStatus 枚举转换为字符串
std::string JudgeResult::status_to_string(JudgeStatus status)
{
    auto it = status_to_str.find(status);
    return (it != status_to_str.end()) ? it->second : "UNKNOWN";
}

// 将字符串转换为 JudgeStatus 枚举
JudgeStatus JudgeResult::string_to_status(const std::string &str)
{
    auto it = str_to_status.find(str);
    return (it != str_to_status.end()) ? it->second : JudgeStatus::CONTACT_ADMIN; // 默认返回 CONTACT_ADMIN
}