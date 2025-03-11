#include <iostream>
#include "sandbox.h"
#include "../config/config.h"

int main() {
    Sandbox sandbox(Config::SANDBOX_DIR);
    std::cout << "Initializing sandbox..." << std::endl;
    if (!sandbox.init()) {
        std::cerr << "Failed to initialize sandbox" << std::endl;
        return 1;
    }
    std::cout << "Sandbox initialized successfully" << std::endl;
    return 0;
}