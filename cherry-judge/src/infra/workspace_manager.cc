#include "infra/workspace_manager.h"

#include <stdexcept>

namespace cherry::infra {

WorkspaceManager::WorkspaceManager(std::filesystem::path root_path)
    : root_path_(std::move(root_path)) {
    if (root_path_.empty()) {
        throw std::invalid_argument("root path cannot be empty");
    }
    std::filesystem::create_directories(root_path_);
}

const std::filesystem::path& WorkspaceManager::RootPath() const {
    return root_path_;
}

std::filesystem::path WorkspaceManager::EnsureSubmissionPath(
    const std::string& submission_id) const {
    auto submission_path = root_path_ / submission_id;
    std::filesystem::create_directories(submission_path);
    return submission_path;
}

std::filesystem::path WorkspaceManager::SourceFilePath(
    const std::string& submission_id, domain::Language language) const {
    auto submission_path = EnsureSubmissionPath(submission_id);
    return submission_path / ("main" + SourceExtension(language));
}

std::filesystem::path WorkspaceManager::ExecutablePath(
    const std::string& submission_id) const {
    auto submission_path = EnsureSubmissionPath(submission_id);
    return submission_path / "main.out";
}

void WorkspaceManager::CleanSumissionPath(
    const std::string& submission_id) const {
    auto submission_path = root_path_ / submission_id;
    std::filesystem::remove_all(submission_path);
}

std::string WorkspaceManager::SourceExtension(domain::Language language) {
    switch (language) {
        case domain::Language::kCpp:
            return ".cpp";
        case domain::Language::kPython:
            return ".py";
        default:
            throw std::invalid_argument("unsupported language");
    }
}

}  // namespace cherry::infra