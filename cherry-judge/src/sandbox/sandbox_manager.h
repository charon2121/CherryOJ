#ifndef SANDBOX_MANAGER
#define SANDBOX_MANAGER

#include <vector>
#include "mount/mount_manager.h"
#include "rootfs/rootfs_manager.h"
#include "sandbox_path.h"

class SandboxManager {
private:
    MountManager mount_manager;  // mount manager for mount points
    RootfsManager rootfs_manager;  // rootfs manager for file system
    std::vector<SandboxPath> sandbox_paths;

public:
    SandboxManager(const std::string &rootfs_path);
    void init_sandbox_paths();
    void create_mount_paths();
    void mount_host_fs();
};

#endif  // SANDBOX_MANAGER