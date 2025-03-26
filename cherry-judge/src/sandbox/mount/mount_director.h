#ifndef MOUNT_DIRECTOR_H
#define MOUNT_DIRECTOR_H

#include "mount_manager.h"

class MountDirector
{
private:
    std::string root_path;

public:
    explicit MountDirector(const std::string &root_path) : root_path(root_path) {}

    /**
     * Construct the rootfs mounts
     * 
     * @param mount_manager The mount manager
     */
    void construct_rootfs_mounts(MountManager &mount_manager);

    /**
     * Construct proc mount
     * 
     * @param mount_manager The mount manager
     */
    void construct_proc_mount(MountManager &mount_manager);
};

#endif  // MOUNT_DIRECTOR_H
