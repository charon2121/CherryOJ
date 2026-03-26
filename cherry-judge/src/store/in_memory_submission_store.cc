#include "store/in_memory_submission_store.h"

namespace cherry::store {
void InMemorySubmissionStore::Save(const domain::Submission& submission) {
    std::lock_guard<std::mutex> lock(mutex_);
    submissions_[submission.submission_id] = submission;
}

std::optional<domain::Submission> InMemorySubmissionStore::Get(
    const std::string& submission_id) const {
    std::lock_guard<std::mutex> lock(mutex_);
    auto iter = submissions_.find(submission_id);
    if (iter == submissions_.end()) {
        return std::nullopt;
    }
    return iter->second;
}

bool InMemorySubmissionStore::Exists(const std::string& submission_id) const {
    std::lock_guard<std::mutex> lock(mutex_);
    return submissions_.find(submission_id) != submissions_.end();
}

size_t InMemorySubmissionStore::Size() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return submissions_.size();
}
}  // namespace cherry::store