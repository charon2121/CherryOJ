#ifndef BUILDER_H
#define BUILDER_H

#include <string>

#include "mount.h"
#include "mount_validator.h"

class MountBuilder
{
private:
    std::string source;
    std::string target;
    std::string fs_type;
    unsigned long flags;
    std::string data;

public:

    MountBuilder &set_source(const std::string &source)
    {
        this->source = source;
        return *this;
    }

    MountBuilder &set_target(const std::string &target)
    {
        this->target = target;
        return *this;
    }

    MountBuilder &set_fs_type(const std::string &fs_type)
    {
        this->fs_type = fs_type;
        return *this;
    }

    MountBuilder &set_flags(unsigned long flags)
    {
        this->flags = flags;
        return *this;
    }

    MountBuilder &set_data(const std::string &data)
    {
        this->data = data;
        return *this;
    }

    Mount build() const {
        Mount mount(source, target, fs_type, flags, data);
        MountValidator::validate(mount);
        return mount;
    }
};
#endif
