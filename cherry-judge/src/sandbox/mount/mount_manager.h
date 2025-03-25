#ifndef MOUNT_MANAGER_H
#define MOUNT_MANAGER_H

#include "mount.h"
#include <vector>

class MountManager
{
private:
    // mount points in the sandbox
    std::vector<Mount> mounts;

public:
    void add_mount(const Mount &mount);
    void remove_mount(const Mount &mount);
};

#endif
