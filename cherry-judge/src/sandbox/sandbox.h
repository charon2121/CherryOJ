#ifndef SANDBOX_H
#define SANDBOX_H

#include <string>

class Sandbox {
public:
    Sandbox(const std::string& root_dir);
    ~Sandbox();

    // 初始化沙箱内部文件系统结构
    bool init();

    // 启动代码沙箱
    void start();

private:
    // 沙箱根目录
    std::string root_dir;
    std::string ipc_socket_path;
    /**
     * overlayfs 的挂载点
     * /root_dir
     *  /lower 宿主机文件系统挂载点
     *    /lib
     *    /usr
     *      /lib
     *      /lib64
     *      /bin
     *      /include
     *  /upper 
     *  /work
     *  /merged
     */
    std::string lower_dir;
    std::string upper_dir;
    std::string work_dir;
    std::string merged_dir;

    // 宿主机文件系统在沙箱内的挂载点
    std::string lib_dir;
    std::string usr_dir;
    std::string usr_lib_dir;
    std::string usr_lib64_dir;
    std::string usr_bin_dir;
    std::string usr_include_dir;

    bool setup_mount_namespace();
    bool setup_overlayfs();
    bool setup_ipc();
};

#endif // SANDBOX_H
