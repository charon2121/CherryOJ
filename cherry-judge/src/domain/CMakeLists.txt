add_library(cherry_domain INTERFACE)

target_include_directories(cherry_domain
   INTERFACE
   ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_domain
    INTERFACE
    thirdparty_json
)
