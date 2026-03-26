#ifndef CHERRY_STORE_RESULT_STORE_H_
#define CHERRY_STORE_RESULT_STORE_H_

#include <cstddef>
#include <optional>
#include <string>

#include "domain/judge_result.h"

namespace cherry::store {
class ResultStore {
   public:
    virtual ~ResultStore() = default;

    virtual void Save(const domain::JudgeResult& result) = 0;
    virtual std::optional<domain::JudgeResult> Get(
        const std::string& submission_id) const = 0;
    virtual bool Exists(const std::string& submission_id) const = 0;
    virtual size_t Size() const = 0;
};
}  // namespace cherry::store

#endif
