#ifndef CHERRY_STORE_IN_MEMORY_RESULT_STORE_H
#define CHERRY_STORE_IN_MEMORY_RESULT_STORE_H

#include <mutex>
#include <string>
#include <unordered_map>

#include "store/result_store.h"

namespace cherry::store {

class InMemoryResultStore final : public ResultStore {
   public:
    void Save(const domain::JudgeResult& result) override;
    std::optional<domain::JudgeResult> Get(
        const std::string& submission_id) const override;
    bool Exists(const std::string& submission_id) const override;
    size_t Size() const override;

   private:
    mutable std::mutex mutex_;
    std::unordered_map<std::string, domain::JudgeResult> results_;
};

}  // namespace cherry::store

#endif