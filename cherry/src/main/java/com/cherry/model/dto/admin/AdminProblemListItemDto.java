package com.cherry.model.dto.admin;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProblemListItemDto {

    private Long id;
    private String problemCode;
    private String title;
    private Integer difficulty;
    private Integer status;
    private Integer judgeMode;
    private Integer defaultTimeLimitMs;
    private Integer defaultMemoryLimitMb;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
