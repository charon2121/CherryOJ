#include <string>
#include <unordered_map>
#include "../common/order_map.h"

/**
 * SandboxFileSystem 用于管理宿主机路径与沙箱路径的映射关系
 */
class SandboxFileSystem
{

public:
    SandboxFileSystem() = default;
    ~SandboxFileSystem() = default;

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
    const std::string &get_mapped_sandbox_path(const std::string &host_source_path) const;

    /**
     * 获取所有已映射的宿主机路径
     *
     * @return 宿主机路径列表（已映射到沙箱的路径）
     */
    const std::vector<std::string> &get_all_host_paths() const;

    /**
     * 获取所有已映射到沙箱的路径
     *
     * @return 沙箱路径列表（已映射的挂载点）
     */
    const std::vector<std::string> &get_all_sandbox_paths() const;

    /**
     * 增加 overlayfs 挂载点路径
     *
     * @param overlayfs_path 挂载点路径
     */
    void add_overlayfs_path(const std::string &overlayfs_type, const std::string &overlayfs_path);

    /**
     * 获取所有 overlayfs 挂载点路径
     *
     * @return 挂载点路径列表
     */
    const std::vector<std::string> &get_all_overlayfs_paths() const;

    /**
     * 获取指定的 overlayfs 挂载点路径
     *
     * @param overlayfs_path 挂载点路径
     * @return 挂载点路径
     */
    const std::string &get_overlayfs_path(const std::string &overlayfs_type) const;

private:
    // overlayfs 挂载点路径
    std::unordered_map<std::string, std::string> overlayfs_paths;
    // 宿主机路径到沙箱路径的映射
    OrderMap<std::string, std::string> host_path_to_sandbox_path;
};
