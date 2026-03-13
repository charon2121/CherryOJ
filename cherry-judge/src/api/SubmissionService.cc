#include "SubmissionService.h"

namespace cherry {
namespace service {
void SubmissionService::createSubmission(const SubmissionId& submissionId,
                                         const ProblemId& problemId,
                                         const std::string& sourceCode,
                                         const std::string& language,
                                         const std::string& input,
                                         const std::string& expectedOutput) {
  std::lock_guard<std::mutex> lock(mutex_);
  submissions_[submissionId] = Submission{
      submissionId, problemId, sourceCode, language, input, expectedOutput};
}

std::optional<Submission> SubmissionService::getSubmission(
    const SubmissionId& submissionId) {
  std::lock_guard<std::mutex> lock(mutex_);
  if (submissions_.find(submissionId) == submissions_.end()) {
    return std::nullopt;
  }
  return std::make_optional<Submission>(submissions_[submissionId]);
}
}  // namespace service
}  // namespace cherry