#ifndef SANDBOX_PATH_H
#define SANDBOX_PATH_H

#include <string>

/**
 * sandbox path type
 */
enum class SandboxPathType {
    // system mount point
    MOUNT_BIND,      // bind mount
    MOUNT_TMPFS,     // tmpfs
    MOUNT_PROC,      // proc
    MOUNT_SYSFS,     // sysfs
    MOUNT_CGROUP,    // cgroup
    MOUNT_CGROUP2,   // cgroup2

    // sandbox internal custom path (not mounted)
    SANDBOX_WORKSPACE,    // workspace
    SANDBOX_TMP,     // tmp
    SANDBOX_LOG,     // log
    SANDBOX_OUTPUT,  // output
    SANDBOX_COMPILE, // compile
    SANDBOX_RUN      // run
};

struct SandboxPath {
    std::string host_path;  // host path
    std::string sandbox_path;  // sandbox path
    SandboxPathType type;  // path type

    SandboxPath(const std::string& host_path, const std::string& sandbox_path, SandboxPathType type)
        : host_path(host_path), sandbox_path(sandbox_path), type(type) {}
};

#endif // SANDBOX_PATH_H