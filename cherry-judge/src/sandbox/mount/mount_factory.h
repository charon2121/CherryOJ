#ifndef MOUNT_CONFIG_H
#define MOUNT_CONFIG_H

#include <string>
#include "mount_builder.h"
#include "mount.h"
#include <filesystem>
#include <iostream>
#include <cstring>

namespace fs = std::filesystem;

class MountFactory
{
public:
    /**
     * Return a bind mount object
     * 
     * @param source The source path
     * @param target The target path
     */
    static Mount bind_mount_ro(const std::string& source, const std::string& target)
    {
        std::string normalized_source;
        std::string normalized_target;

        try {
            // 规范化目标路径
            if (target.empty()) {
                throw std::invalid_argument("[MountFactory] Target path cannot be empty");
            }
            normalized_target = fs::absolute(target).string();
            
            // 处理源路径
            if (source.empty()) {
                normalized_source = "none";  // 对于空路径，使用 "none" 作为源
            } else {
                // 检查源路径是否存在
                if (!fs::exists(source)) {
                    std::string error = "[MountFactory] Source path does not exist: " + source;
                    std::cerr << error << std::endl;
                    throw std::runtime_error(error);
                }
                normalized_source = fs::absolute(source).string();
            }

            std::cout << "[MountFactory] Creating bind mount: " << normalized_source << " -> " << normalized_target << std::endl;

            return MountBuilder()
                .set_source(normalized_source)
                .set_target(normalized_target)
                .set_fs_type(FsType::BIND)
                .set_flags(MS_BIND | MS_RDONLY)
                .build();
        } catch (const fs::filesystem_error& e) {
            std::string error = "[MountFactory] Failed to process paths: " + std::string(e.what());
            std::cerr << error << std::endl;
            throw std::runtime_error(error);
        } catch (const std::exception& e) {
            std::string error = "[MountFactory] Error: " + std::string(e.what());
            std::cerr << error << std::endl;
            throw;
        }
    }

    /**
     * Return a proc mount object
     * 
     * @param target The target path
     */
    static Mount proc_mount(const std::string& target)
    {
        try {
            if (target.empty()) {
                throw std::invalid_argument("[MountFactory] Target path cannot be empty");
            }
            // 规范化路径
            std::string normalized_target = fs::absolute(target).string();

            return MountBuilder()
                .set_target(normalized_target)
                .set_fs_type(FsType::PROC)
                .build();
        } catch (const fs::filesystem_error& e) {
            std::string error = "[MountFactory] Failed to process target path: " + std::string(e.what());
            std::cerr << error << std::endl;
            throw std::runtime_error(error);
        } catch (const std::exception& e) {
            std::string error = "[MountFactory] Error: " + std::string(e.what());
            std::cerr << error << std::endl;
            throw;
        }
    }

    MountFactory() = delete;
    MountFactory(const MountFactory&) = delete;
    MountFactory& operator=(const MountFactory&) = delete;
};

#endif // MOUNT_CONFIG_H