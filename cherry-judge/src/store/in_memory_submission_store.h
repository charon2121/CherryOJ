#ifndef CHERRY_STORE_IN_MEMORY_SUBMISSION_STORE_H
#define CHERRY_STORE_IN_MEMORY_SUBMISSION_STORE_H

#include <mutex>
#include <string>
#include <unordered_map>

#include "store/submission_store.h"

namespace cherry::store {
class InMemorySubmissionStore final : public SubmissionStore {
   public:
    void Save(const domain::Submission& submission) override;
    std::optional<domain::Submission> Get(
        const std::string& submission_id) const override;
    bool Exists(const std::string& submission_id) const override;
    size_t Size() const override;

   private:
    mutable std::mutex mutex_;
    std::unordered_map<std::string, domain::Submission> submissions_;
};
}  // namespace cherry::store

#endif
