#ifndef MOUNT_CONFIG_H
#define MOUNT_CONFIG_H

#include <string>
#include "mount_builder.h"
#include "mount.h"

class MountConfig
{
private:
    static MountBuilder builder;

public:
    MountConfig() = default;

    /**
     * Bind mount a directory read-only
     * 
     * @param source The source path
     * @param target The target path
     */
    static const Mount& bind_mount_ro(const std::string &source, const std::string &target)
    {
        return builder.set_source(source)
            .set_target(target)
            .set_fs_type(FsType::BIND)
            .set_flags(MS_BIND | MS_RDONLY)
            .build();
    }
};

#endif // MOUNT_CONFIG_H