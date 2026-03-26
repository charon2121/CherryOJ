#include "store/in_memory_result_store.h"

namespace cherry::store {
void InMemoryResultStore::Save(const domain::JudgeResult& result) {
    std::lock_guard<std::mutex> lock(mutex_);
    results_[result.submission_id] = result;
}

std::optional<domain::JudgeResult> InMemoryResultStore::Get(
    const std::string& submission_id) const {
    std::lock_guard<std::mutex> lock(mutex_);
    auto iter = results_.find(submission_id);
    if (iter == results_.end()) {
        return std::nullopt;
    }
    return iter->second;
}

bool InMemoryResultStore::Exists(const std::string& submission_id) const {
    std::lock_guard<std::mutex> lock(mutex_);
    return results_.find(submission_id) != results_.end();
}

size_t InMemoryResultStore::Size() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return results_.size();
}
}  // namespace cherry::store
