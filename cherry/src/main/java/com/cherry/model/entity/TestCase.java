package com.cherry.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TestCase {

    private Long id;
    private Long problemId;
    private Integer caseNo;
    private String inputData;
    private String expectedOutput;
    private Integer score;
    private Integer isSample;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
