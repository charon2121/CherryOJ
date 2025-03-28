#ifndef SANDBOX_MANAGER
#define SANDBOX_MANAGER

#include <vector>
#include "mount/mount_manager.h"
#include "sandbox_path.h"
#include "mount/mount.h"

class SandboxManager {
private:
    // mount manager for mount points
    MountManager mount_manager;
    // the sandbox inner paths
    std::vector<SandboxPath> sandbox_paths;
    // the sandbox root path
    std::string root_path;
    // the sandbox workspace path
    std::string workspace_path;

    /**
     * Convert sandbox path to mount point class
     * 
     * @param path The sandbox path
     * @return The mount point class
     */
    Mount convert_to_mount(const SandboxPath &path);

    /**
     * Init sandbox paths
     */
    void init_sandbox_paths();

    /**
     * mkdir all the sandbox paths
     */
    void mkdir_sandbox_paths();

    /**
     * init all sandbox mount class
     */
    void init_sandbox_mounts();
public:
    SandboxManager() = default;
    SandboxManager(const std::string &root_path);

    ~SandboxManager();

    /**
     * mount sandbox paths
     */
    void mount_sandbox_paths();

    /**
     * umount sandbox paths
     */
    void umount_sandbox_paths();
};

#endif  // SANDBOX_MANAGER