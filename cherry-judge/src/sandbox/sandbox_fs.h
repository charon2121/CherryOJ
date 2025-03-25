#ifndef SANDBOX_FS_H
#define SANDBOX_FS_H

#include <string>
#include <unordered_map>
#include <stdexcept>
#include "../common/order_map.h"
#include <sys/mount.h>
class Mount
{
private:
    std::string source;  // 挂载源路径
    std::string target;  // 挂载目标路径
    std::string fs_type; // 挂载类型
    unsigned long flags; // 挂载标志
    std::string data;    // 挂载选项

    void do_mount() {
        mount(source.c_str(), target.c_str(), fs_type.c_str(), flags, data.c_str());
    }
public:
    Mount(const MountBuilder &builder)
    {
        this->source = builder.source;
        this->target = builder.target;
        this->fs_type = builder.fs_type;
        this->flags = builder.flags;
        this->data = builder.data;
    }

    std::string get_source() const { return source; }
    std::string get_target() const { return target; }
    std::string get_fs_type() const { return fs_type; }
    unsigned long get_flags() const { return flags; }
    std::string get_data() const { return data; }
};

/**
 * 挂载点构建器
 */
class MountBuilder
{
private:
    std::string source;
    std::string target;
    std::string fs_type;
    unsigned long flags;
    std::string data;

public:
    friend class Mount;

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

    Mount build()
    {
        if (target.empty())
        {
            throw std::invalid_argument("Mount target must be set.");
        }
        if (fs_type.empty() && source.empty())
        {
            throw std::invalid_argument("At least one of fs_type or source must be set.");
        }
        return Mount(*this);
    }
};

class MountDirector {
private:
    MountBuilder &builder;

public:
    MountDirector(MountBuilder &builder) : builder(builder) {}
    Mount build() {
        return builder.build();
    }

    Mount build_bind_mount() {
        return builder
        .set_fs_type("bind")
        .set_flags(MS_BIND | MS_REC)
        .build();
    }

    Mount build_bind_mount_ro() {
        return builder
        .set_fs_type("bind")
        .set_flags(MS_BIND | MS_REC | MS_RDONLY)
        .build();
    }
};

/**
 * SandboxFileSystem 用于管理宿主机路径与沙箱路径的映射关系
 */
class SandboxFileSystem
{
public:
    SandboxFileSystem(std::string root_path) : root_path(root_path) {}
    ~SandboxFileSystem() = default;
    /**
     * 初始化挂载点
     */
    void init_sandbox_paths();

    /**
     * 创建挂载点
     */
    void create_mount_paths();

    /**
     * 挂载宿主机的文件系统到沙箱内部
     * mount --bind + remount 挂载为只读
     */
    void mount_host_fs();

    /**
     * 卸载沙箱内部的挂载点
     */
    void umount_sandbox_fs();

    /**
     * 挂载 overlayfs
     */
    void mount_overlayfs();

    /**
     * 卸载 overlayfs
     */
    // void umount_overlayfs();
private:
    /**
     * 映射宿主机路径到沙箱内
     *
     * @param host_source_path   宿主机上的路径（源路径）
     * @param sandbox_target_path  沙箱内的路径（挂载点）
     */
    void mapping_host_path(const std::string &host_source_path, const std::string &sandbox_target_path);

    /**
     * 获取宿主机路径在沙箱内的映射路径
     *
     * @param host_source_path  宿主机上的路径（源路径）
     * @return 对应的沙箱内映射路径（挂载点）
     */
    std::string get_mapped_sandbox_path(const std::string &host_source_path) const;

    /**
     * 获取所有已映射的宿主机路径
     *
     * @return 宿主机路径列表（已映射到沙箱的路径）
     */
    std::vector<std::string> get_all_host_paths() const;

    /**
     * 获取所有已映射到沙箱的路径
     *
     * @return 沙箱路径列表（已映射的挂载点）
     */
    std::vector<std::string> get_all_sandbox_paths() const;

    /**
     * 获取所有 overlayfs 挂载点路径
     *
     * @return 挂载点路径列表
     */
    std::vector<std::string> get_all_overlayfs_paths() const;

    /**
     * 增加 overlayfs 挂载点路径
     *
     * @param overlayfs_path 挂载点路径
     */
    void add_overlayfs_path(const std::string &overlayfs_type, const std::string &overlayfs_path);

    /**
     * 获取指定的 overlayfs 挂载点路径
     *
     * @param overlayfs_path 挂载点路径
     * @return 挂载点路径
     */
    std::string get_overlayfs_path(const std::string &overlayfs_type) const;

    /**
     * 沙箱根路径
     */
    std::string root_path;

    /**
     * overlayfs 挂载点路径
     */
    std::unordered_map<std::string, std::string> overlayfs_paths;

    /**
     * 宿主机路径到沙箱路径的映射
     */
    OrderMap<std::string, std::string> host_path_to_sandbox_path;
};

#endif // SANDBOX_FS_H
