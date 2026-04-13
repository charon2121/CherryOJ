package com.cherry.model.dto.admin;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProblemDetailDto {

    private Long id;
    private String problemCode;
    private String title;
    private Integer judgeMode;
    private Integer defaultTimeLimitMs;
    private Integer defaultMemoryLimitMb;
    private Integer defaultStackLimitMb;
    private Integer difficulty;
    private Integer status;
    private String description;
    private String hint;
    private String source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AdminProblemTestCaseDto> testCases;
}
