package com.cherry.model.dto.admin;

import java.util.List;

import lombok.Data;

@Data
public class AdminProblemUpsertRequest {

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
    private List<AdminProblemTestCaseInput> testCases;

    @Data
    public static class AdminProblemTestCaseInput {
        private Long id;
        private Integer caseNo;
        private String inputData;
        private String expectedOutput;
        private Integer score;
        private Integer isSample;
        private Integer status;
    }
}
