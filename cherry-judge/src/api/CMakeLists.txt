add_library(cherry_api
    http_server.cc
)

target_include_directories(cherry_api
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_api
    PUBLIC
    cherry_app
    cherry_store
)