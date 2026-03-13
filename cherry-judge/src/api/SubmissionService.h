#ifndef CHERRY_API_SUBMISSION_SERVICE_H
#define CHERRY_API_SUBMISSION_SERVICE_H

#include <mutex>
#include <optional>
#include <string>
#include <unordered_map>

#include "type/Type.h"

namespace cherry {
namespace service {

struct Submission {
  SubmissionId submissionId;
  ProblemId problemId;
  std::string sourceCode;
  std::string language;
  std::string input;
  std::string expectedOutput;
  std::string actualOutput;
};

class SubmissionService {
 public:
  explicit SubmissionService() = default;
  ~SubmissionService() = default;

  void createSubmission(const SubmissionId& submissionId,
                        const ProblemId& problemId,
                        const std::string& sourceCode,
                        const std::string& language, const std::string& input,
                        const std::string& expectedOutput);

  std::optional<Submission> getSubmission(const SubmissionId& submisssionId);

 private:
  std::mutex mutex_;
  std::unordered_map<SubmissionId, Submission> submissions_;
};
}  // namespace service
}  // namespace cherry

#endif