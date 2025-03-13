#include "sandbox_fs.h"

void SandboxFileSystem::mapping_host_path(const std::string &host_source_path, const std::string &sandbox_target_path) {
    host_path_to_sandbox_path.add(host_source_path, sandbox_target_path);
}

const std::string &SandboxFileSystem::get_mapped_sandbox_path(const std::string &host_source_path) const {
    return host_path_to_sandbox_path.get(host_source_path);
}

const std::vector<std::string> &SandboxFileSystem::get_all_host_paths() const {
    return host_path_to_sandbox_path.get_keys();
}

const std::vector<std::string> &SandboxFileSystem::get_all_sandbox_paths() const {
    return host_path_to_sandbox_path.get_values();
}

void SandboxFileSystem::add_overlayfs_path(const std::string &overlayfs_type, const std::string &overlayfs_path) {
    overlayfs_paths[overlayfs_type] = overlayfs_path;
}

const std::vector<std::string> &SandboxFileSystem::get_all_overlayfs_paths() const {
    static std::vector<std::string> values;
    values.clear();
    for (const auto &pair : overlayfs_paths) {
        values.push_back(pair.second);
    }
    return values;
}

const std::string &SandboxFileSystem::get_overlayfs_path(const std::string &overlayfs_type) const {
    return overlayfs_paths.at(overlayfs_type);
}