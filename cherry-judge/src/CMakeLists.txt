find_package(Threads REQUIRED)

add_library(api
    api/HttpServer.cc
)

target_include_directories(api 
    PUBLIC 
        ${CMAKE_CURRENT_SOURCE_DIR}
)

add_library(service
    api/SubmissionService.cc
)

target_include_directories(service
    PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(api
    PUBLIC
        service
        Threads::Threads
)

add_executable(http_server
    api/main.cc
)

target_link_libraries(http_server
    PRIVATE
        api
)
