#ifndef ROOTFS_MANAGER_H
#define ROOTFS_MANAGER_H

#include <string>

class RootfsManager {
private:
    std::string rootfs_path;

public:
    RootfsManager(const std::string &rootfs_path);
};

#endif // ROOTFS_MANAGER_H
