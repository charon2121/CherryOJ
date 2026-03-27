#include "judge/exact_match_checker.h"

namespace cherry::judge {
bool ExactMatchChecker::IsMatch(const std::string& expected,
                                const std::string& actual) const {
    return expected == actual;
}

}  // namespace cherry::judge