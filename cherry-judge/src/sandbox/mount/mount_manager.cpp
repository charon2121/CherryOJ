#include "mount_manager.h"
#include <algorithm>

void MountManager::add_mount(const Mount &m)
{
    mounts.push_back(m);
}

void MountManager::remove_mount(const Mount &m)
{
    mounts.erase(std::remove(mounts.begin(), mounts.end(), m), mounts.end());
}

void MountManager::apply_all()
{
    for (const auto &m : mounts)
    {
        mount_executer.do_mount(m);
        mounted_targets.push_back(m.get_target());
    }
}

void MountManager::rollback()
{
    for (const auto &target : mounted_targets)
    {
        mount_executer.do_umount(target);
    }
}

const std::vector<Mount> &MountManager::get_mounts() const
{
    return mounts;
}

const std::vector<std::string> &MountManager::get_mounted_targets() const
{
    return mounted_targets;
}