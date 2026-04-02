package com.cherry.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Problem {

    private Long id;
    private String problemCode;
    private String title;
    private Integer judgeMode;
    private Integer defaultTimeLimitMs;
    private Integer defaultMemoryLimitMb;
    private Integer defaultStackLimitMb;
    private Integer difficulty;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
