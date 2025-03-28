#include "sandbox_manager.h"
#include "mount/mount_factory.h"
#include <unordered_set>

#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

SandboxManager::SandboxManager(const std::string &root_path) 
    : root_path(root_path) {
    if (root_path.empty()) {
        throw std::invalid_argument("Root path cannot be empty");
    }
    // 移除 root_path 末尾的斜杠
    if (!root_path.empty() && root_path.back() == '/') {
        this->root_path.pop_back();
    }
    init_sandbox_paths();
    mkdir_sandbox_paths();
    init_sandbox_mounts();
}

SandboxManager::~SandboxManager() {
    // umount_sandbox_paths();
}

void SandboxManager::init_sandbox_paths() {
    // 这里暂时硬编码，后续可通过配置文件优化
    // 需要 bind 的宿主机路径
    sandbox_paths.push_back(SandboxPath("/bin", root_path + "/bin", SandboxPathType::MOUNT_BIND));
    sandbox_paths.push_back(SandboxPath("/usr", root_path + "/usr", SandboxPathType::MOUNT_BIND));
    sandbox_paths.push_back(SandboxPath("/lib", root_path + "/lib", SandboxPathType::MOUNT_BIND));
    sandbox_paths.push_back(SandboxPath("/lib64", root_path + "/lib64", SandboxPathType::MOUNT_BIND));

    // 沙箱内的工作目录
    sandbox_paths.push_back(SandboxPath("", root_path + "/workspace", SandboxPathType::SANDBOX_WORKSPACE));
    workspace_path = root_path + "/workspace";

    std::cout << "root_path: " << root_path << std::endl;
}

void SandboxManager::mkdir_sandbox_paths() {
    try {
        // ensure root_path exists
        fs::create_directories(root_path);
        
        for (const auto &path : sandbox_paths) {
            if (path.type == SandboxPathType::MOUNT_BIND) {
                // 检查源目录是否存在
                if (!fs::exists(path.host_path)) {
                    std::string error = "Host path does not exist: " + path.host_path;
                    std::cerr << error << std::endl;
                    throw std::runtime_error(error);
                }
                if (!fs::is_directory(path.host_path)) {
                    std::string error = "Host path is not a directory: " + path.host_path;
                    std::cerr << error << std::endl;
                    throw std::runtime_error(error);
                }
            }
            
            // 创建目标目录
            fs::create_directories(path.sandbox_path);
        }
    } catch (const fs::filesystem_error& e) {
        std::string error = "Failed to create directories: " + std::string(e.what());
        std::cerr << error << std::endl;
        throw std::runtime_error(error);
    }
}

Mount SandboxManager::convert_to_mount(const SandboxPath &path) {
    switch (path.type) {
        case SandboxPathType::MOUNT_BIND:
            return MountFactory::bind_mount_ro(path.host_path, path.sandbox_path);
        case SandboxPathType::MOUNT_PROC:
            return MountFactory::proc_mount(path.sandbox_path);
        default:
            throw std::invalid_argument("Invalid sandbox path type");
    }
}

void SandboxManager::init_sandbox_mounts() {
    // 允许挂载的 sandbox path type
    std::unordered_set<SandboxPathType> permit_types = {
        SandboxPathType::MOUNT_BIND,
        SandboxPathType::MOUNT_PROC,
        SandboxPathType::MOUNT_TMPFS,
        SandboxPathType::MOUNT_CGROUP,
        SandboxPathType::MOUNT_CGROUP2,
        SandboxPathType::MOUNT_SYSFS
    };
    
    for (const auto &path : sandbox_paths) {
        if (permit_types.count(path.type) == 0) {
            continue;
        }
        std::cout << "Adding mount: " << path.host_path << " -> " << path.sandbox_path << std::endl;
        Mount mount = convert_to_mount(path);
        mount_manager.add_mount(mount);
    }
}

void SandboxManager::mount_sandbox_paths() {
    mount_manager.apply_all();
}

void SandboxManager::umount_sandbox_paths() {
    mount_manager.rollback();
}