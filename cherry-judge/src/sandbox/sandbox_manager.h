#ifndef SANDBOX_MANAGER
#define SANDBOX_MANAGER

#include <vector>
#include "mount/mount_manager.h"
#include "sandbox_path.h"

class SandboxManager {
private:
    MountManager mount_manager;  // 挂载管理器
};

#endif  // SANDBOX_MANAGER