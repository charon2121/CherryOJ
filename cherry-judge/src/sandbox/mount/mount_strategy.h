#ifndef MOUNT_STRATEGY_H
#define MOUNT_STRATEGY_H

#include "mount.h"
#include <stdexcept>
#include <iostream>
#include <sys/stat.h>
#include <filesystem>
#include <fstream>

namespace fs = std::filesystem;

/**
 * Mount strategy interface
 */
class MountStrategy {
public:
    /**
     * Execute a mount operation
     * 
     * @param m The mount configuration
     */
    virtual void execute_mount(const Mount& m) = 0;

    /**
     * Destructor
     */
    virtual ~MountStrategy() = default;

    /**
     * Ensure the target directory exists
     * 
     * @param target The target directory
     */
    void ensure_target_directory_exists(const std::string& target) {
        if (!fs::is_directory(target)) {
            fs::create_directories(target);
        }
    }
};

/**
 * Bind Mount Strategy
 * 
 * To bind a read-only directory from the host into the sandbox, two steps are required.
 *
 * Using the `mount` command:
 *   1. mount -o bind /host/dir /sandbox/dir
 *   2. mount -o remount,ro /sandbox/dir
 *
 * Using the `mount` system call:
 *   1. mount("/host/dir", "/sandbox/dir", NULL, MS_BIND, NULL);
 *   2. mount(NULL, "/sandbox/dir", NULL, MS_BIND | MS_REMOUNT | MS_RDONLY, NULL);
 *
 * This is because the MS_BIND and MS_RDONLY flags cannot be combined in a single mount call.
 * Therefore, if the mount configuration includes the MS_RDONLY flag, the mount executor
 * must perform an additional remount step to apply the read-only property.
 */
class BindMountStrategy : public MountStrategy {
private:
    /**
     * 确保目标目录存在，如果不存在则创建
     * 
     * @param target 目标目录路径
     * @throws std::runtime_error 如果目录创建失败
     */
    void ensure_target_directory_exists(const std::string& target) {
        try {
            std::cout << "[BindMountStrategy] Checking target directory: " << target << std::endl;
            
            // 检查路径是否为空
            if (target.empty()) {
                throw std::invalid_argument("Target path cannot be empty");
            }

            // 检查路径是否存在
            if (!fs::exists(target)) {
                std::cout << "[BindMountStrategy] Target directory does not exist, creating: " << target << std::endl;
                fs::create_directories(target);
                std::cout << "[BindMountStrategy] Successfully created target directory" << std::endl;
            } else {
                // 如果路径存在，检查是否是目录
                if (!fs::is_directory(target)) {
                    std::string error = "Target path exists but is not a directory: " + target;
                    std::cerr << error << std::endl;
                    throw std::runtime_error(error);
                }
                std::cout << "[BindMountStrategy] Target directory already exists" << std::endl;
            }

            // 检查目录权限
            if (!fs::is_directory(target)) {
                std::string error = "Failed to create or access target directory: " + target;
                std::cerr << error << std::endl;
                throw std::runtime_error(error);
            }

            // 检查目录是否可写
            try {
                fs::path test_file = fs::path(target) / ".test";
                std::ofstream test(test_file);
                if (test.is_open()) {
                    test.close();
                    fs::remove(test_file);
                } else {
                    std::string error = "Target directory is not writable: " + target;
                    std::cerr << error << std::endl;
                    throw std::runtime_error(error);
                }
            } catch (const std::exception& e) {
                std::string error = "Failed to check directory permissions: " + std::string(e.what());
                std::cerr << error << std::endl;
                throw std::runtime_error(error);
            }

        } catch (const fs::filesystem_error& e) {
            std::string error = "Filesystem error while ensuring target directory: " + std::string(e.what());
            std::cerr << error << std::endl;
            throw std::runtime_error(error);
        } catch (const std::exception& e) {
            std::string error = "Error while ensuring target directory: " + std::string(e.what());
            std::cerr << error << std::endl;
            throw;
        }
    }

public:
    void execute_mount(const Mount& m) override {
        if (m.get_fs_type() != FsType::BIND) { 
            throw std::invalid_argument("[BindMountStrategy] BindMountStrategy can only be used for bind mounts");
        }

        const std::string& source = m.get_source();
        const std::string& target = m.get_target();

        std::cout << "[BindMountStrategy] Processing mount: " << source << " -> " << target << std::endl;

        // 确保目标目录存在
        ensure_target_directory_exists(target);

        // 检查源路径
        if (source != "none") {
            if (!fs::exists(source)) {
                std::string error = "[BindMountStrategy] Source path does not exist: " + source;
                std::cerr << error << std::endl;
                throw std::runtime_error(error);
            }

            if (!fs::is_directory(source)) {
                std::string error = "[BindMountStrategy] Source path is not a directory: " + source;
                std::cerr << error << std::endl;
                throw std::runtime_error(error);
            }
        }

        std::cout << "[BindMountStrategy] Attempting to mount " << source << " to " << target << std::endl;

        // First mount: bind mount
        if (mount(source.c_str(), target.c_str(), nullptr, MS_BIND, nullptr) != 0) {
            std::string error = "[BindMountStrategy] Failed to mount " + source + " to " + target + 
                              ": " + strerror(errno);
            std::cerr << error << std::endl;
            throw std::runtime_error(error);
        }

        // Second mount: remount read-only if needed
        if (m.get_flags() & MS_RDONLY) {
            std::cout << "[BindMountStrategy] Remounting " << target << " as read-only" << std::endl;
            
            if (mount(nullptr, target.c_str(), nullptr, MS_BIND | MS_REMOUNT | MS_RDONLY, nullptr) != 0) {
                std::string error = "[BindMountStrategy] Failed to remount " + target + 
                                  " as read-only: " + strerror(errno);
                std::cerr << error << std::endl;
                throw std::runtime_error(error);
            }
        }
    }
};

/**
 * Proc Mount Strategy
 * 
 * Mount a proc filesystem
 * 
 * Using the `mount` command:
 *   1. mount -t proc proc /sandbox/proc
 * 
 * Using the `mount` system call:
 *   1. mount("proc", "/sandbox/proc", NULL, MS_BIND, NULL);
 */
class ProcMountStrategy : public MountStrategy {
public:
    void execute_mount(const Mount& m) override {
        // check if the mount is a proc mount
        if (m.get_fs_type() != FsType::PROC) {
            throw std::invalid_argument("[ProcMountStrategy] ProcMountStrategy can only be used for proc mounts");
        }

        const char* target = m.get_target().c_str();

        // mount the proc filesystem
        if (mount("proc", target, "proc", NULL, NULL) != 0) {
            throw std::runtime_error("[ProcMountStrategy] Failed to mount proc to " + m.get_target());
        }
    }
};
#endif
