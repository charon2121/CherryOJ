#ifndef MOUNT_EXECUTER_H
#define MOUNT_EXECUTER_H

#include <sys/mount.h>
#include <stdexcept>
#include <cerrno>
#include <cstring>
#include <map>
#include <memory>

#include "mount.h"
#include "mount_strategy.h"

class MountExecuter
{
private:
    std::map<FsType, std::unique_ptr<MountStrategy>> strategies;

    void init_strategies() {  // add strategies here
        strategies[FsType::BIND] = std::make_unique<BindMountStrategy>();
        strategies[FsType::PROC] = std::make_unique<ProcMountStrategy>();
    }

public:
    MountExecuter() {
        init_strategies();
    }

    /**
     * Execute a mount operation
     * 
     * @param m The mount configuration
     */
    void do_mount(const Mount &m) {
        if (strategies.find(m.get_fs_type()) == strategies.end()) {
            throw std::invalid_argument("[MountExecuter] Unsupported filesystem type: " + m.fs_type_to_string());
        }
        strategies[m.get_fs_type()]->execute_mount(m);
    }

    /**
     * Remove a mount point from the sandbox
     * 
     * @param target The target path to remove
     */
    void do_umount(const std::string &target)
    {
        if (umount2(target.c_str(), MNT_DETACH) != 0) {
            throw std::runtime_error("[MountExecuter]: umount failed: " + std::string(strerror(errno)));
        }
    }
};

#endif
