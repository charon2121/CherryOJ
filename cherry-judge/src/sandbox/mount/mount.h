#ifndef MOUNT_H
#define MOUNT_H

#include <string>
#include <sys/mount.h>

class Mount
{
private:
    std::string source;  // 挂载源路径
    std::string target;  // 挂载目标路径
    std::string fs_type; // 挂载类型
    unsigned long flags; // 挂载标志
    std::string data;    // 挂载选项

public:

    Mount() = default;

    Mount(const std::string &source, const std::string &target, const std::string &fs_type, unsigned long flags, const std::string &data)
        : source(source), target(target), fs_type(fs_type), flags(flags), data(data) {}

    std::string get_source() const { return source; }
    std::string get_target() const { return target; }
    std::string get_fs_type() const { return fs_type; }
    unsigned long get_flags() const { return flags; }
    std::string get_data() const { return data; }
};

#endif