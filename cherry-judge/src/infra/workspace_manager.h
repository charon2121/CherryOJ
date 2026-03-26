#ifndef CHERRY_INFRA_WORKSPACE_MANAGER_H_
#define CHERRY_INFRA_WORKSPACE_MANAGER_H_

#include <filesystem>
#include <string>

#include "domain/language.h"

namespace cherry::infra {

class WorkspaceManager {
   public:
    explicit WorkspaceManager(std::filesystem::path root_path);

    const std::filesystem::path& RootPath() const;

    std::filesystem::path EnsureSubmissionPath(
        const std::string& submission_id) const;

    std::filesystem::path SourceFilePath(const std::string& submission_id,
                                         domain::Language language) const;

    std::filesystem::path ExecutablePath(
        const std::string& submission_id) const;

    void CleanSumissionPath(const std::string& submission_id) const;

   private:
    static std::string SourceExtension(domain::Language language);

   private:
    std::filesystem::path root_path_;
};

}  // namespace cherry::infra

#endif
