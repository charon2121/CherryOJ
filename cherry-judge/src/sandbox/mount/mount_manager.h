#ifndef MOUNT_MANAGER_H
#define MOUNT_MANAGER_H

#include "mount.h"
#include <vector>
#include "mount_executer.h"

class MountManager
{
private:
    // mount points in the sandbox
    std::vector<Mount> mounts;
    // mounted targets
    std::vector<std::string> mounted_targets;

    // mount executer
    MountExecuter mount_executer;
public:
    /**
     * Add a mount point to the sandbox
     * 
     * @param m The mount point to add
     */
    void add_mount(const Mount &m);

    /**
     * Remove a mount point from the sandbox
     * 
     * @param m The mount point to remove
     */
    void remove_mount(const Mount &m);

    /**
     * Apply all mount points to the sandbox
     */
    void apply_all();

    /**
     * Remove all mount points from the sandbox
     */
    void rollback();

    /**
     * Get the mounts
     * 
     * @return The mounts
     */
    const std::vector<Mount> &get_mounts() const;

    /**
     * Get the mounted targets
     * 
     * @return The mounted targets
     */
    const std::vector<std::string> &get_mounted_targets() const;
};

#endif
