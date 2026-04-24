#ifndef CHERRY_APP_WEBHOOK_CLIENT_H_
#define CHERRY_APP_WEBHOOK_CLIENT_H_

#include <string>

#include "domain/judge_result.h"
#include "domain/judge_task.h"

namespace cherry::app {

class WebhookClient {
   public:
    explicit WebhookClient(std::string token);

    void NotifyFinished(const domain::JudgeTask& task,
                        const domain::JudgeResult& result) const;
    void NotifyFailed(const domain::JudgeTask& task,
                      const std::string& message) const;

   private:
    void Post(const domain::JudgeTask& task, const std::string& body) const;

   private:
    std::string token_;
};

}  // namespace cherry::app

#endif
