#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>
#include <sys/mount.h>
#include <sys/stat.h>
#include "sandbox.h"
#include "sandbox_path.h"

// 构造函数，初始化沙箱文件系统
Sandbox::Sandbox(const std::string &root_path) : root_path(root_path)
{
    // overlayfs 的挂载点目录
    sandbox_fs.add_overlayfs_path(OVERLAYFS_LOWER, root_path + OVERLAYFS_LOWER);
    sandbox_fs.add_overlayfs_path(OVERLAYFS_UPPER, root_path + OVERLAYFS_UPPER);
    sandbox_fs.add_overlayfs_path(OVERLAYFS_WORK, root_path + OVERLAYFS_WORK);
    sandbox_fs.add_overlayfs_path(OVERLAYFS_MERGED, root_path + OVERLAYFS_MERGED);

    // 沙箱内 lower 目录挂载点
    std::string lower_dir = root_path + OVERLAYFS_LOWER;

    // 映射宿主机路径到沙箱内
    sandbox_fs.mapping_host_path(LIB, lower_dir + LIB);
    sandbox_fs.mapping_host_path(USR_LIB, lower_dir + USR_LIB);
    sandbox_fs.mapping_host_path(USR_LIB64, lower_dir + USR_LIB64);
    sandbox_fs.mapping_host_path(USR_BIN, lower_dir + USR_BIN);
    sandbox_fs.mapping_host_path(USR_INCLUDE, lower_dir + USR_INCLUDE);
}

// 析构函数
Sandbox::~Sandbox()
{
}

// 初始化代码沙箱
bool Sandbox::init()
{
    // 设置命名空间
    set_namespace();
    // 挂载宿主机文件系统到沙箱内
    mount_host_fs();
    // 挂载 overlayfs
    mount_overlayfs();
    return true;
}

// 设置 namespace
void Sandbox::set_namespace()
{
    // 创建新的挂载命令空间
    if (unshare(CLONE_NEWNS) != 0)
    {
        perror("unshare(CLONE_NEWNS) failed");
        exit(1);
    }
}

// 挂载宿主机的文件系统
void Sandbox::mount_host_fs()
{
    // 表示将挂载点设置为private模式，后续挂载或卸载操作不再对外传播。
    if (mount("none", "/", NULL, MS_REC | MS_PRIVATE, NULL) != 0)
    {
        perror("mount MS_REC|MS_PRIVATE failed");
        exit(1);
    }

    // 挂载宿主机路径到沙箱内
    const std::vector<std::string> &host_paths = sandbox_fs.get_all_host_paths();
    for (const auto &host_path : host_paths)
    {
        if (mount(host_path.c_str(),
                  sandbox_fs.get_mapped_sandbox_path(host_path).c_str(),
                  NULL, MS_BIND, NULL) != 0)
        {
            perror(std::string("mount " + host_path + " failed").c_str());
            exit(1);
        }
    }

    // remount 挂载点为只读模式
    const std::vector<std::string> &sandbox_paths = sandbox_fs.get_all_sandbox_paths();
    for (const auto &sandbox_path : sandbox_paths)
    {
        if (mount(NULL, sandbox_path.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0)
        {
            perror(std::string("remount " + sandbox_path + " failed").c_str());
            exit(1);
        }
    }
}

// 挂载 overlayfs
void Sandbox::mount_overlayfs()
{
    std::string options = "lowerdir=" + sandbox_fs.get_overlayfs_path(OVERLAYFS_LOWER) +
                          ",upperdir=" + sandbox_fs.get_overlayfs_path(OVERLAYFS_UPPER) +
                          ",workdir=" + sandbox_fs.get_overlayfs_path(OVERLAYFS_WORK);

    if (mount("overlay", sandbox_fs.get_overlayfs_path(OVERLAYFS_MERGED).c_str(),
              "overlay", 0, options.c_str()) != 0)
    {
        perror(std::string("mount overlay failed").c_str());
        exit(1);
    }
}
