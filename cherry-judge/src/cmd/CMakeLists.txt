add_executable(cherry_gateway 
    gateway_main.cc
)

target_link_libraries(
    cherry_gateway
    PRIVATE
    cherry_domain
    cherry_app
    cherry_infra
    cherry_execution
    cherry_judge
    cherry_store
    cherry_queue
)
