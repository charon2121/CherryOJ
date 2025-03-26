#ifndef MOUNT_VALIDATOR_H
#define MOUNT_VALIDATOR_H

#include "mount.h"
#include <stdexcept>
#include <string>
#include <sys/mount.h>
#include <vector>

class MountValidator
{
public:
    // for an online judge sandbox, it's enough to check the mount system call is valid.
    // but for a real system, need more checks.
    static void validate(const Mount &mount) {
        if (mount.get_target().empty()) {
            throw std::invalid_argument("[mount validator] target must be set.");
        }

        if ((mount.get_flags() & MS_BIND) && mount.get_source().empty()) {
            throw std::invalid_argument("[mount validator] bind mount requires a source path.");
        }

        if ((mount.get_flags() & MS_REMOUNT) && mount.get_source().empty()) {
            throw std::invalid_argument("[mount validator] remount requires a source path.");
        }

        if (mount.get_fs_type() == "overlay") {
            if (mount.get_source() != "overlay") {
                throw std::invalid_argument("[mount validator] overlay fs should have source set to 'overlay'.");
            }
            if (mount.get_data().find("lowerdir=") == std::string::npos ||
                mount.get_data().find("upperdir=") == std::string::npos ||
                mount.get_data().find("workdir=") == std::string::npos) {
                throw std::invalid_argument("[mount validator] overlayfs requires lowerdir, upperdir, and workdir in data.");
            }
        }

        if (mount.get_fs_type() == "proc" && mount.get_source() != "none") {
            throw std::invalid_argument("[mount validator] proc mount should have source set to 'none'.");
        }

        if (mount.get_fs_type() == "tmpfs") {
            if (mount.get_source().empty()) {
                throw std::invalid_argument("[mount validator] tmpfs mount should have source set to 'none' or 'tmpfs'.");
            }
        }

        if (!mount.get_fs_type().empty()) {
            static const std::vector<std::string> known_fs = {
                "proc", "tmpfs", "sysfs", "overlay", "cgroup", "cgroup2", "mqueue", "devtmpfs", "bind"
            };
            bool matched = false;
            for (const auto& fs : known_fs) {
                if (mount.get_fs_type() == fs) {
                    matched = true;
                    break;
                }
            }
            if (!matched && !(mount.get_flags() & MS_BIND)) {
                throw std::invalid_argument("[mount validator] unknown filesystem type: " + mount.get_fs_type());
            }
        }
    }
};
#endif
