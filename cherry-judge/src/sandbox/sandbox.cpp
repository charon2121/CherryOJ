#include <iostream>
#include <fstream>
#include <cstdlib>
#include <sys/resource.h>
#include <sys/wait.h>
#include <unistd.h>
#include <sys/mount.h>
#include <sys/stat.h>
#include "sandbox.h"



// 构造函数
Sandbox::Sandbox(const std::string& root_dir) : root_dir(root_dir) {
    // overlayfs 的挂载点
    lower_dir = root_dir + "/lower";
    upper_dir = root_dir + "/upper";
    work_dir = root_dir + "/work";
    merged_dir = root_dir + "/merged";

    // 宿主机文件系统在沙箱内的挂载点
    lib_dir = lower_dir + "/lib";
    usr_dir = lower_dir + "/usr";
    usr_lib_dir = usr_dir + "/lib";
    usr_lib64_dir = usr_dir + "/lib64";
    usr_bin_dir = usr_dir + "/bin";
    usr_include_dir = usr_dir + "/include";

    // 创建挂载点
    // 检查 root_dir 是否存在
    if (access(root_dir.c_str(), F_OK) == -1) {
        // 创建 root_dir
        mkdir(root_dir.c_str(), 0755);
    }

    mkdir(lower_dir.c_str(), 0755);
    mkdir(upper_dir.c_str(), 0755);
    mkdir(work_dir.c_str(), 0755);
    mkdir(merged_dir.c_str(), 0755);
    mkdir(lib_dir.c_str(), 0755);
    mkdir(usr_dir.c_str(), 0755);
    mkdir(usr_lib_dir.c_str(), 0755);
    mkdir(usr_lib64_dir.c_str(), 0755);
    mkdir(usr_bin_dir.c_str(), 0755);
    mkdir(usr_include_dir.c_str(), 0755);
}
// 析构函数
Sandbox::~Sandbox() {
    // 卸载挂载点
    umount(lib_dir.c_str());
    umount(usr_lib_dir.c_str());
    umount(usr_lib64_dir.c_str());
    umount(usr_bin_dir.c_str());
    umount(usr_include_dir.c_str());
    umount(merged_dir.c_str());

    // 删除文件目录
    rmdir(lib_dir.c_str());
    rmdir(usr_lib_dir.c_str());
    rmdir(usr_lib64_dir.c_str());
    rmdir(usr_bin_dir.c_str());
    rmdir(usr_include_dir.c_str());
    rmdir(usr_dir.c_str());
    rmdir(merged_dir.c_str());
    rmdir(work_dir.c_str());
    rmdir(upper_dir.c_str());
    rmdir(lower_dir.c_str());
    rmdir(root_dir.c_str());
}

// 初始化代码沙箱
bool Sandbox::init() {

    // 设置命名空间
    set_namespace();
    // 挂载宿主机文件系统到沙箱内
    mount_host_fs();
    if (mount("/lib", lib_dir.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("mount /lib failed");
        return false;
    }

    if (mount("/usr/lib", usr_lib_dir.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("mount /usr/lib failed");
        return false;
    }

    if (mount("/usr/lib64", usr_lib64_dir.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("mount /usr/lib64 failed");
        return false;
    }

    if (mount("/usr/bin", usr_bin_dir.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("mount /usr/bin failed");
        return false;
    }

    if (mount("/usr/include", usr_include_dir.c_str(), NULL, MS_BIND, NULL) != 0) {
        perror("mount /usr/include failed");
        return false;
    }

    // remount 挂载点为只读模式
    if (mount(NULL, lib_dir.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0) {
        perror("remount /lib failed");
        return false;
    }   

    if (mount(NULL, usr_lib_dir.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0) {
        perror("remount /usr/lib failed");
        return false;
    }   

    if (mount(NULL, usr_lib64_dir.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0) {
        perror("remount /usr/lib64 failed");
        return false;
    }      

    if (mount(NULL, usr_bin_dir.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0) {
        perror("remount /usr/bin failed");
        return false;
    }      

    if (mount(NULL, usr_include_dir.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0) {
        perror("remount /usr/include failed");
        return false;
    }

    // 挂载 overlayfs
    std::string options = "lowerdir=" + lower_dir + ",upperdir=" + upper_dir + ",workdir=" + work_dir;

    if (mount("overlay", merged_dir.c_str(), "overlay", 0, options.c_str()) != 0) {
        perror("mount overlay failed");
        return false;
    }

    return true;
}

// 设置 namespace
void Sandbox::set_namespace() {
    // 创建新的挂载命令空间
    if (unshare(CLONE_NEWNS) != 0) {
        perror("unshare(CLONE_NEWNS) failed");
        exit(1);
    }
}

// 挂载宿主机的文件系统
void Sandbox::mount_host_fs() {
    // 表示将挂载点设置为private模式，后续挂载或卸载操作不再对外传播。
    if (mount("none", "/", NULL, MS_REC | MS_PRIVATE, NULL) != 0) {
        perror("mount MS_REC|MS_PRIVATE failed");
        exit(1);
    }
}