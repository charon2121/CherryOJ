package com.cherry.controller;

import com.cherry.auth.RequireLogin;
import com.cherry.common.api.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    /**
     * 获取判题结果
     */
    @GetMapping("/{submissionId}")
    public ApiResponse<Void> getSubmission(@PathVariable Long submissionId) {
        return ApiResponse.ok();
    }

    /**
     * 提交代码
     */
    @RequireLogin
    @PostMapping
    public ApiResponse<Void> submit() {
        return ApiResponse.ok();
    }
}
