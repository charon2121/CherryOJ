-- 用户表
CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1正常 0禁用',
    `is_admin` TINYINT NOT NULL DEFAULT 0 COMMENT '是否是管理员: 1是 0不是',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_username` (`username`),
    UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 编程语言表
CREATE TABLE `language` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '语言ID',
    `code` VARCHAR(30) NOT NULL COMMENT '语言标识，如 cpp17/java17/python3',
    `name` VARCHAR(50) NOT NULL COMMENT '语言名称',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_language_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='编程语言表';

-- 题目表
CREATE TABLE `problem` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '题目ID',
    `problem_code` VARCHAR(50) NOT NULL COMMENT '题目标识，如 1001 / two-sum',
    `title` VARCHAR(200) NOT NULL COMMENT '题目标题',
    `judge_mode` TINYINT NOT NULL COMMENT '判题模式: 1-ACM模式, 2-核心代码模式',
    `default_time_limit_ms` INT NOT NULL COMMENT '默认时间限制(毫秒)',
    `default_memory_limit_mb` INT NOT NULL COMMENT '默认内存限制(MB)',
    `default_stack_limit_mb` INT DEFAULT NULL COMMENT '默认栈限制(MB)，可选',
    `difficulty` TINYINT NOT NULL DEFAULT 1 COMMENT '难度: 1简单 2中等 3困难',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1可用 0下线',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_problem_code` (`problem_code`),
    KEY `idx_problem_status` (`status`),
    KEY `idx_problem_mode` (`judge_mode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目主表';

-- 题目描述表
CREATE TABLE `problem_statement` (
    `problem_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
    `description` MEDIUMTEXT NOT NULL COMMENT '题目描述',
    `hint` MEDIUMTEXT DEFAULT NULL COMMENT '提示',
    `source` VARCHAR(200) DEFAULT NULL COMMENT '题目来源',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`problem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目描述表';

-- 语言限制表
CREATE TABLE `problem_language_limit` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `problem_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
    `language_id` BIGINT UNSIGNED NOT NULL COMMENT '语言ID',
    `time_limit_ms` INT NOT NULL COMMENT '该语言时间限制(毫秒)',
    `memory_limit_mb` INT NOT NULL COMMENT '该语言内存限制(MB)',
    `stack_limit_mb` INT DEFAULT NULL COMMENT '该语言栈限制(MB)，可选',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_problem_language` (`problem_id`, `language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目语言特殊限制表';

-- 测试点表
CREATE TABLE `test_case` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '测试点ID',
    `problem_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
    `case_no` INT NOT NULL COMMENT '测试点序号',
    `input_data` MEDIUMTEXT DEFAULT NULL COMMENT '输入数据',
    `expected_output` MEDIUMTEXT DEFAULT NULL COMMENT '期望输出',
    `score` INT NOT NULL DEFAULT 0 COMMENT '该测试点分值，可用于OI/部分得分',
    `is_sample` TINYINT NOT NULL DEFAULT 0 COMMENT '是否样例: 1是 0否',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_problem_case_no` (`problem_id`, `case_no`),
    KEY `idx_problem_sample` (`problem_id`, `is_sample`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目测试点表';

-- 提交记录表
CREATE TABLE `submission` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '提交ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `problem_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
    `language_id` BIGINT UNSIGNED NOT NULL COMMENT '语言ID',
    `submit_mode` TINYINT NOT NULL COMMENT '提交模式: 1-ACM源码 2-核心代码',
    `source_code` MEDIUMTEXT NOT NULL COMMENT '提交源码',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '提交状态: 1待判题 2判题中 3已完成 4系统错误',
    `result_code` VARCHAR(30) DEFAULT NULL COMMENT '结果: Accepted/Wrong Answer/TLE/MLE/RE/CE等',
    `score` INT NOT NULL DEFAULT 0 COMMENT '得分',
    `time_used_ms` INT DEFAULT NULL COMMENT '最终耗时(毫秒)',
    `memory_used_kb` INT DEFAULT NULL COMMENT '最终内存(KB)',
    `code_length` INT NOT NULL DEFAULT 0 COMMENT '代码长度',
    `judged_at` DATETIME DEFAULT NULL COMMENT '判题完成时间',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_submission_user` (`user_id`, `created_at` DESC),
    KEY `idx_submission_problem` (`problem_id`, `created_at` DESC),
    KEY `idx_submission_status` (`status`, `created_at` DESC),
    KEY `idx_submission_result` (`result_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提交记录表';

-- 提交测试点明细表
CREATE TABLE `submission_test_case_result` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `submission_id` BIGINT UNSIGNED NOT NULL COMMENT '提交ID',
    `test_case_id` BIGINT UNSIGNED NOT NULL COMMENT '测试点ID',
    `case_no` INT NOT NULL COMMENT '测试点序号',
    `result_code` VARCHAR(30) NOT NULL COMMENT '该测试点结果',
    `time_used_ms` INT DEFAULT NULL COMMENT '该测试点耗时(毫秒)',
    `memory_used_kb` INT DEFAULT NULL COMMENT '该测试点内存(KB)',
    `message` VARCHAR(500) DEFAULT NULL COMMENT '附加信息',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_submission_case` (`submission_id`, `test_case_id`),
    KEY `idx_submission_case_submission` (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提交测试点结果表';

-- 核心代码题目配置表
CREATE TABLE `problem_template` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `problem_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
    `language_id` BIGINT UNSIGNED NOT NULL COMMENT '语言ID',
    `template_code` MEDIUMTEXT DEFAULT NULL COMMENT '用户可见代码模板',
    `wrapper_code` MEDIUMTEXT DEFAULT NULL COMMENT '判题包装代码',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='核心代码模式模板表';
