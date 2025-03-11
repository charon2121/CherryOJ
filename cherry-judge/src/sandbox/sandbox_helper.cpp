#include <iostream>
#include "sandbox.h"
#include "../config/config.h"
#include <unistd.h>

int main() {
    Sandbox sandbox(Config::SANDBOX_DIR);
    std::cout << "Initializing sandbox..." << std::endl;
    if (!sandbox.init()) {
        std::cerr << "Failed to initialize sandbox" << std::endl;
        return 1;
    }

    system("ls /home/ubuntu/cherry/workspace/sandbox/lower/usr/include");

    std::cout << "Sandbox initialized successfully" << std::endl;
    return 0;
}