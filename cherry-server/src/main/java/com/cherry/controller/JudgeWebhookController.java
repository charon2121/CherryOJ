package com.cherry.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cherry.common.api.ApiResponse;
import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.config.JudgeProperties;
import com.cherry.model.dto.judge.JudgeWebhookRequest;
import com.cherry.service.OjSubmissionFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/internal/judge")
@RequiredArgsConstructor
public class JudgeWebhookController {

    private final JudgeProperties judgeProperties;
    private final OjSubmissionFacadeService ojSubmissionFacadeService;

    @PostMapping("/webhook")
    public ApiResponse<Map<String, Boolean>> webhook(
            @RequestHeader(value = "X-Judge-Token", required = false) String token,
            @RequestBody JudgeWebhookRequest request) {
        if (!judgeProperties.getWebhookToken().equals(token)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED, "Judge webhook token 无效");
        }
        ojSubmissionFacadeService.applyJudgeWebhook(request);
        return ApiResponse.ok(Map.of("accepted", true));
    }
}
