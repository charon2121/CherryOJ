#ifndef CHERRY_JUDGE_EXACT_MATCH_CHECKER_H_
#define CHERRY_JUDGE_EXACT_MATCH_CHECKER_H_

#include "judge/output_checker.h"

namespace cherry::judge {

class ExactMatchChecker final : public OutputChecker {
   public:
    bool IsMatch(const std::string& expected,
                 const std::string& actual) const override;
};
}  // namespace cherry::judge

#endif
