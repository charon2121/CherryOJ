#include "sandbox_ns.h"
#include <sched.h>
#include <cstdio>
#include <cstdlib>

void SandboxNamespace::set_namespace() {
    if (unshare(CLONE_NEWNS) == -1) {
        perror("unshare");
        exit(1);
    }   
}