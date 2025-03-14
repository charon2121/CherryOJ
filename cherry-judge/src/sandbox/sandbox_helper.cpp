#include <iostream>
#include "sandbox.h"
#include <unistd.h>

int main(int argc, char *argv[]) {
    Sandbox sandbox("/home/ubuntu/cherry/workspace/sandbox");
    std::cout << "Initializing sandbox..." << std::endl;
    if (!sandbox.init()) {
        std::cerr << "Failed to initialize sandbox" << std::endl;
        return 1;
    }

    std::cout << "Sandbox initialized successfully" << std::endl;
    return 0;
}