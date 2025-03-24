#include <iostream>
#include <filesystem>
#include <vector>
#include <string>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/mount.h>
#include "sandbox_fs.h"
#include "sandbox_path.h"

// 在文件开头添加显式实例化
template class OrderMap<std::string, std::string>;

void SandboxFileSystem::init_sandbox_paths() {
    add_overlayfs_path(OVERLAYFS_LOWER, root_path + OVERLAYFS_LOWER);
    add_overlayfs_path(OVERLAYFS_UPPER, root_path + OVERLAYFS_UPPER);
    add_overlayfs_path(OVERLAYFS_WORK, root_path + OVERLAYFS_WORK);
    add_overlayfs_path(OVERLAYFS_MERGED, root_path + OVERLAYFS_MERGED);

     // 沙箱内 lower 目录挂载点
    std::string lower_dir = root_path + OVERLAYFS_LOWER;

    mapping_host_path(LIB, lower_dir + LIB);
    mapping_host_path(USR_LIB, lower_dir + USR_LIB);
    mapping_host_path(USR_LIB64, lower_dir + USR_LIB64);
    mapping_host_path(USR_BIN, lower_dir + USR_BIN);
    mapping_host_path(USR_INCLUDE, lower_dir + USR_INCLUDE); 
}

void SandboxFileSystem::create_mount_paths() {
    // 检查根目录是否存在
    if (!std::filesystem::exists(root_path)) {
        if (!std::filesystem::create_directories(root_path)) {
            std::cerr << "create root_path dir failed" << std::endl;
            exit(1);
        }
    }

    std::vector<std::string> overlayfs_paths = get_all_overlayfs_paths();
    for (const auto &path : overlayfs_paths) {
        if (!std::filesystem::exists(path)) {
            if (!std::filesystem::create_directories(path)) {
                std::cerr << "create overlayfs path failed" << std::endl;
                exit(1);
            }
        }
    }

    std::vector<std::string> sandbox_paths = get_all_sandbox_paths();
    for (const auto &path : sandbox_paths) {
        if (!std::filesystem::exists(path)) {
            if (!std::filesystem::create_directories(path)) {
                std::cerr << "create sandbox path failed" << std::endl;
                exit(1);
            }
        }
    }
}

void SandboxFileSystem::mount_host_fs() {
    // 将挂载点设置为 private 模式，后续挂载或卸载操作不再对外传播
    if (mount("none", "/", NULL, MS_REC | MS_PRIVATE, NULL) != 0) {
        perror("mount MS_REC|MS_PRIVATE failed");
        exit(1);
    }

    // 挂载宿主机路径到沙箱内
    const std::vector<std::string> &host_paths = get_all_host_paths();
    for (const auto &host_path : host_paths)
    {
        if (mount(host_path.c_str(),
                  get_mapped_sandbox_path(host_path).c_str(),
                  NULL, MS_BIND, NULL) != 0)
        {
            perror(std::string("mount " + host_path + " failed").c_str());
            exit(1);
        }
    }

    // remount 挂载点为只读模式
    const std::vector<std::string> &sandbox_paths = get_all_sandbox_paths();
    for (const auto &sandbox_path : sandbox_paths)
    {
        if (mount(NULL, sandbox_path.c_str(), NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL) != 0)
        {
            perror(std::string("remount " + sandbox_path + " failed").c_str());
            exit(1);
        }
    }
}

void SandboxFileSystem::umount_sandbox_fs() {
    const std::vector<std::string> &sandbox_paths = get_all_sandbox_paths();
    for (const auto &sandbox_path : sandbox_paths) {
        if (umount(sandbox_path.c_str()) != 0) {
            perror(std::string("umount " + sandbox_path + " failed").c_str());
            exit(1);
        }
    }
}

void SandboxFileSystem::mount_overlayfs() {
    std::string options = "lowerdir=" + get_overlayfs_path(OVERLAYFS_LOWER) +
                          ",upperdir=" + get_overlayfs_path(OVERLAYFS_UPPER) +
                          ",workdir=" + get_overlayfs_path(OVERLAYFS_WORK);

    if (mount("overlay", get_overlayfs_path(OVERLAYFS_MERGED).c_str(),
              "overlay", NULL, options.c_str()) != 0) {
        perror(std::string("mount overlay failed").c_str());
        exit(1);
    }
}

void SandboxFileSystem::mapping_host_path(const std::string &host_source_path, const std::string &sandbox_target_path) {
    host_path_to_sandbox_path.add(host_source_path, sandbox_target_path);
}

std::string SandboxFileSystem::get_mapped_sandbox_path(const std::string &host_source_path) const {
    return host_path_to_sandbox_path.get(host_source_path);
}

std::vector<std::string> SandboxFileSystem::get_all_host_paths() const {
    return host_path_to_sandbox_path.get_keys();
}

std::vector<std::string> SandboxFileSystem::get_all_sandbox_paths() const {
    return host_path_to_sandbox_path.get_values();
}

void SandboxFileSystem::add_overlayfs_path(const std::string &overlayfs_type, const std::string &overlayfs_path) {
    overlayfs_paths[overlayfs_type] = overlayfs_path;
}

std::vector<std::string> SandboxFileSystem::get_all_overlayfs_paths() const {
    static std::vector<std::string> values;
    values.clear();
    for (const auto &pair : overlayfs_paths) {
        values.push_back(pair.second);
    }
    return values;
}

std::string SandboxFileSystem::get_overlayfs_path(const std::string &overlayfs_type) const {
    return overlayfs_paths.at(overlayfs_type);
}