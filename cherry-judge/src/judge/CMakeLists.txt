add_library(cherry_judge
    judge_engine.cc
    exact_match_checker.cc
)

target_include_directories(cherry_judge
    PUBLIC
    ${PROJECT_SOURCE_DIR}/src
)

target_link_libraries(cherry_judge
    PUBLIC
    cherry_domain
)
