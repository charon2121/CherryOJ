#ifndef FILESYSTEM_UTILS_H
#define FILESYSTEM_UTILS_H

#include <filesystem>
#include <iostream>
#include <stdexcept>
#include <string>

namespace fs = std::filesystem;

/**
 * ensure the directory exists
 * 
 * @param dir_path the directory path
 */
void ensure_path_exists(const std::string &path) {
    try {
        // if the path exists
        if (fs::exists(path)) {
            // if it is not a directory, throw an exception
            if (!fs::is_directory(path)) {
                throw std::runtime_error("Path exists but is not a directory: " + path);
            }
        } else {
            // try to create the directory and its necessary parent directories
            if (!fs::create_directories(path)) {
                throw std::runtime_error("Failed to create directory: " + path);
            }
        }
    } catch (const fs::filesystem_error &e) {
        std::cerr << "Filesystem error: " << e.what() << std::endl;
        throw;
    }
}

#endif