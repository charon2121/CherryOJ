add_executable(cherry_gateway 
    gateway_main.cc
)

target_link_libraries(
    cherry_gateway
    PRIVATE
    cherry_domain
)
