#pragma once

#include <chrono>
#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace cherry::v2::model {

using TaskId = std::string;
using SubmissionId = std::string;
using ProblemId = std::string;
using TraceId = std::string;
using CaseId = std::string;

enum class Language { kCpp17, kPython3 };

enum class Verdict {
    kPending,
    kAccepted,
    kWrongAnswer,
    kTimeLimitExceeded,
    kMemoryLimitExceeded,
    kOutputLimitExceeded,
    kRuntimeError,
    kCompilationError,
    kSystemError,
};

enum class TaskPhase { kQueued, kCompiling, kRunning, kJudging, kFinished };

struct ResourceLimits {
    int64_t time_limit_ms = 1000;
    int64_t memory_limit_mb = 256;
    int64_t output_limit_kb = 1024;
    int64_t pids_limit = 64;
};

struct TestCaseSpec {
    CaseId case_id;
    std::string input;
    std::string expected_output;
    int score = 0;
};

struct JudgeTask {
    TaskId task_id;
    SubmissionId submission_id;
    ProblemId problem_id;
    TraceId trace_id;
    Language language = Language::kCpp17;
    std::string source_code;
    ResourceLimits limits;
    std::vector<TestCaseSpec> testcases;
    int attempt = 1;
    std::chrono::system_clock::time_point created_at;
};

struct CompileResult {
    bool ok = false;
    int exit_code = -1;
    std::string binary_path;
    std::string stderr_text;
    int64_t elapsed_ms = 0;
};

struct RunResult {
    CaseId case_id;
    Verdict verdict = Verdict::kSystemError;
    int exit_code = -1;
    int term_signal = 0;
    int64_t time_ms = 0;
    int64_t memory_kb = 0;
    std::string stdout_text;
    std::string stderr_text;
};

struct JudgeResult {
    TaskId task_id;
    SubmissionId submission_id;
    Verdict final_verdict = Verdict::kPending;
    int total_score = 0;
    int passed_cases = 0;
    int total_cases = 0;
    std::optional<CompileResult> compile;
    std::vector<RunResult> case_results;
    int64_t total_time_ms = 0;
    int64_t peak_memory_kb = 0;
};

}  // namespace cherry::v2::model
