find_package(Threads REQUIRED)

add_library(cherry_http
    http/HttpServer.cc
    http/SubmissionService.cc
)

target_link_libraries(cherry_http
    
)