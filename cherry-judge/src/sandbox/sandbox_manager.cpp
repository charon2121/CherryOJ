#include "sandbox_manager.h"

SandboxManager::SandboxManager(const std::string &rootfs_path) 
    : rootfs_path(rootfs_path),
      rootfs_manager(rootfs_path) {}
