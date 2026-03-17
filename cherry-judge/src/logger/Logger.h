#ifndef CHERRY_LOGGER_LOGGER_H_
#define CHERRY_LOGGER_LOGGER_H_

#include <iostream>

#define LOG_INFO(module, msg) \
    do { \
        std::cout << "[" << module << "] " << msg << "\n"; \
    } while (0)

#endif
