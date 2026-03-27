#ifndef CHERRY_JUDGE_OUTPUT_CHECKER_H_
#define CHERRY_JUDGE_OUTPUT_CHECKER_H_

#include <string>

namespace cherry::judge {
class OutputChecker {
   public:
    virtual ~OutputChecker() = default;
    virtual bool IsMatch(const std::string& expected,
                         const std::string& actual) const = 0;
};
}  // namespace cherry::judge

#endif
