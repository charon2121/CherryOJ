#ifndef MOUNT_STRATEGY_H
#define MOUNT_STRATEGY_H

#include "mount.h"
#include <stdexcept>

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
};

/**
 *                                 Bind Mount Strategy
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
public:
    void execute_mount(const Mount& m) override {
        // check if the mount is a bind mount
        if (m.get_fs_type() != FsType::BIND) { 
            throw std::invalid_argument("[BindMountStrategy] BindMountStrategy can only be used for bind mounts");
        }

        const char* source = m.get_source().empty() ? nullptr : m.get_source().c_str();
        const char* target = m.get_target().c_str();

        // mount the bind mount
        if (mount(source, target, NULL, MS_BIND, NULL) != 0) {  
            throw std::runtime_error("[BindMountStrategy] Failed to mount " + m.get_source() + " to " + m.get_target());
        }

        // if the mount is read-only, remount it as read-only
        if (m.get_flags() & MS_RDONLY) {  
            if (mount(NULL, target, NULL, MS_BIND | MS_RDONLY | MS_REMOUNT, NULL) != 0) {
                throw std::runtime_error("[BindMountStrategy] Failed to remount " + m.get_source() + " to " + m.get_target());
            }
        }
    }
};

/**
 *                                 Proc Mount Strategy
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
