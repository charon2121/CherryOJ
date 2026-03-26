#ifndef CHERRY_STORE_SUBMISSION_STORE_H_
#define CHERRY_STORE_SUBMISSION_STORE_H_

#include <cstddef>
#include <optional>
#include <string>

#include "domain/submission.h"

namespace cherry::store {
class SubmissionStore {
   public:
    virtual ~SubmissionStore() = default;

    virtual void Save(const domain::Submission& submission) = 0;
    virtual std::optional<domain::Submission> Get(
        const std::string& submission_id) const = 0;
    virtual bool Exists(const std::string& submission_id) const = 0;
    virtual size_t Size() const = 0;
};
}  // namespace cherry::store

#endif
