#ifndef MOUNT_CONFIG_H
#define MOUNT_CONFIG_H

#include <string>
#include "mount_builder.h"
#include "mount.h"

class MountFactory
{
public:
    /**
     * Return a bind mount object
     *
     * @param source The source path
     * @param target The target path
     */
    static Mount bind_mount_ro(const std::string &source, const std::string &target)
    {
        return MountBuilder()
            .set_source(source)
            .set_target(target)
            .set_fs_type(FsType::BIND)
            .set_flags(MS_BIND | MS_RDONLY)
            .build();
    }

    /**
     * Return a proc mount object
     *
     * @param target The target path
     */
    static Mount proc_mount(const std::string &target)
    {
        return MountBuilder()
            .set_target(target)
            .set_fs_type(FsType::PROC)
            .build();
    }

    MountFactory() = delete;
    MountFactory(const MountFactory &) = delete;
    MountFactory &operator=(const MountFactory &) = delete;
};

#endif // MOUNT_CONFIG_H