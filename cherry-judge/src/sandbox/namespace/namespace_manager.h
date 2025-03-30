#ifndef NAMESPACE_MANAGER_H
#define NAMESPACE_MANAGER_H

#include <unistd.h>
#include <sched.h>

class NamespaceManager {
public:
    NamespaceManager() = default;
    ~NamespaceManager() = default;
    void create_namespace() {
        unshare(CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWUSER);
    }
};

#endif
