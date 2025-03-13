#include <../common/order_map.h>
#include <string>
/**
 * 沙箱内的文件系统
 */
class SandboxFileSystem {
 
public:
    SandboxFileSystem() = default;
    ~SandboxFileSystem() = default;
    // 添加 overlayfs 目录
    void add_overlayfs_dir(const std::string& key, const std::string& path);

    // 添加宿主机映射目录
    void add_host_mapping_dir(const std::string& host_dir, const std::string& sandbox_dir);

    // 获取 overlayfs 目录
    const std::string& get_overlayfs_dir(const std::string& key) const;

    // 获取宿主机映射目录
    const std::string& get_host_mapping_dir(const std::string& host_dir) const;


private:
    OrderMap<std::string, std::string> overlayfs_dirs;
    OrderMap<std::string, std::string> host_mapping_dirs;
};
