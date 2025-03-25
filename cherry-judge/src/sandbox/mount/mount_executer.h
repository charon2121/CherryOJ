#ifndef MOUNT_EXECUTER_H
#define MOUNT_EXECUTER_H

#include "mount.h"
#include <sys/mount.h>
#include <stdexcept>
#include <cerrno>
#include <cstring>

/**
 * To bind a read-only directory from the host into the sandbox, two steps are required.
 *
 * Using the `mount` command:
 *   1. mount -o bind /host/dir /sandbox/dir
 *   2. mount -o remount,ro /sandbox/dir
 *
 * Using the `mount` system call:
 *   1. mount("/host/dir", "/sandbox/dir", NULL, MS_BIND, NULL);
 *   2. mount(NULL, "/sandbox/dir", NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL);
 *
 * This is because the MS_BIND and MS_RDONLY flags cannot be combined in a single mount call.
 * Therefore, if the mount configuration includes the MS_RDONLY flag, the mount executor
 * must perform an additional remount step to apply the read-only property.
 */
class MountExecuter
{
private:
    void bind_remount(const Mount &m)
    {
        const char *target = m.get_target().c_str();
        if (mount(NULL, target, NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0)
        {
            perror("[MountExecuter]: failed to mount");
            // if remount failed, umount the target
            if (umount2(target, MNT_DETACH) != 0)
            {
                perror("[MountExecuter]: failed to umount");
            }
            throw std::runtime_error("mount failed: " + std::string(strerror(errno)));
        }
    }

    // if mount object's flags has MS_BIND and MS_RDONLY flag,
    // we need to do one more step to handle it.
    bool should_remount_readonly(const Mount &m)
    {
        return (m.get_flags() & MS_BIND) && (m.get_flags() & MS_RDONLY);
    }

public:
    void do_mount(const Mount &m)
    {
        const char *source = m.get_source().empty() ? NULL : m.get_source().c_str();
        const char *target = m.get_target().c_str(); // target must not be empty
        const char *fs_type = m.get_fs_type().empty() ? NULL : m.get_fs_type().c_str();
        const char *data = m.get_data().empty() ? NULL : m.get_data().c_str();

        if (mount(source, target, fs_type, m.get_flags(), data) != 0)
        {
            perror("[MountExecuter]: failed to mount");
            throw std::runtime_error("mount failed: " + std::string(strerror(errno)));
        }

        if (should_remount_readonly(m)) {
            bind_remount(m);
        }
    }

    void do_umount(const Mount &m)
    {
        if (umount2(m.get_target().c_str(), MNT_DETACH) != 0)
        {
            perror("[MountExecuter]: failed to umount");
            exit(1);
        }
    }
};

#endif
