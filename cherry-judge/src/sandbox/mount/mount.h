#ifndef MOUNT_H
#define MOUNT_H

#include <string>
#include <sys/mount.h>

enum class FsType {
    BIND,  // bind
    TMPFS, // tmpfs
    PROC,  // proc
    SYSFS, // sysfs
    CGROUP, // cgroup
    CGROUP2, // cgroup2
    OVERLAY, // overlay
    UNKNOWN  // unknown fs type...
};

class Mount
{
private:
    std::string source;  // 挂载源路径
    std::string target;  // 挂载目标路径
    FsType fs_type; // 挂载类型
    unsigned long flags; // 挂载标志
    std::string data;    // 挂载选项

public:

    Mount() = default;

    Mount(const std::string &source, const std::string &target, FsType fs_type, unsigned long flags, const std::string &data)
        : source(source), target(target), fs_type(fs_type), flags(flags), data(data) {}

    std::string get_source() const { return source; }
    std::string get_target() const { return target; }
    FsType get_fs_type() const { return fs_type; }
    unsigned long get_flags() const { return flags; }
    std::string get_data() const { return data; }

    std::string fs_type_to_string() const {
        switch (fs_type) {
            case FsType::BIND: return "bind";
            case FsType::TMPFS: return "tmpfs";
            case FsType::PROC: return "proc";
            case FsType::SYSFS: return "sysfs";
            case FsType::CGROUP: return "cgroup";
            case FsType::CGROUP2: return "cgroup2";
            case FsType::OVERLAY: return "overlay";
            case FsType::UNKNOWN: return "unknown";
        }
    }
};

#endif