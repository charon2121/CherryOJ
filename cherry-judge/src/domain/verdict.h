#ifndef CHERRY_DOMAIN_VERDICT_H_
#define CHERRY_DOMAIN_VERDICT_H_

#include <nlohmann/json.hpp>
#include <stdexcept>
#include <string>

namespace cherry::domain {

enum class Verdict {
    kPending,
    kAccepted,
    kWrongAnswer,
    kCompilationError,
    kRuntimeError,
    kTimeLimitExceeded,
    kSystemError,
};

inline std::string VerdictToString(Verdict verdict) {
    switch (verdict) {
        case Verdict::kPending:
            return "PENDING";
        case Verdict::kAccepted:
            return "AC";
        case Verdict::kWrongAnswer:
            return "WA";
        case Verdict::kCompilationError:
            return "CE";
        case Verdict::kRuntimeError:
            return "RE";
        case Verdict::kTimeLimitExceeded:
            return "TLE";
        case Verdict::kSystemError:
            return "SE";
        default:
            return "SE";
    }
}

inline Verdict VerdictFromString(const std::string& value) {
    if (value == "PENDING") return Verdict::kPending;
    if (value == "AC") return Verdict::kAccepted;
    if (value == "WA") return Verdict::kWrongAnswer;
    if (value == "CE") return Verdict::kCompilationError;
    if (value == "RE") return Verdict::kRuntimeError;
    if (value == "TLE") return Verdict::kTimeLimitExceeded;
    if (value == "SE") return Verdict::kSystemError;
    throw std::invalid_argument("unsupported verdict: " + value);
}

inline void to_json(nlohmann::json& json, const Verdict& verdict) {
    json = VerdictToString(verdict);
}

inline void from_json(const nlohmann::json& json, Verdict& verdict) {
    verdict = VerdictFromString(json.get<std::string>());
}

}  // namespace cherry::domain

#endif