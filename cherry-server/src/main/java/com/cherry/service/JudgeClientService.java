package com.cherry.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.config.JudgeProperties;
import com.cherry.model.dto.judge.JudgeResultDto;
import com.cherry.model.dto.judge.JudgeSubmissionStatusDto;
import com.cherry.model.entity.Problem;
import com.cherry.model.entity.Submission;
import com.cherry.model.entity.TestCase;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JudgeClientService {

    private final JudgeProperties judgeProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public JudgeClientService(JudgeProperties judgeProperties, ObjectMapper objectMapper) {
        this.judgeProperties = judgeProperties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(judgeProperties.getConnectTimeoutMs()))
                .build();
    }

    public JudgeResultDto judge(Submission submission, Problem problem, String languageCode, List<TestCase> testCases) {
        if (!judgeProperties.isEnabled()) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge service is disabled");
        }

        String judgeLanguage = normalizeLanguage(languageCode);
        submit(submission, problem, judgeLanguage, testCases);

        long deadline = System.currentTimeMillis() + judgeProperties.getMaxWaitMs();
        while (System.currentTimeMillis() <= deadline) {
            JudgeSubmissionStatusDto status = fetchStatus(submission.getId());
            if ("finished".equalsIgnoreCase(status.getStatus())) {
                if (status.getResult() == null) {
                    throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge service returned empty result");
                }
                return status.getResult();
            }
            sleepPollInterval();
        }

        throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge service polling timeout");
    }

    private void submit(Submission submission, Problem problem, String judgeLanguage, List<TestCase> testCases) {
        Map<String, Object> payload = Map.of(
                "submission_id", String.valueOf(submission.getId()),
                "problem_id", String.valueOf(problem.getId()),
                "language", judgeLanguage,
                "source_code", submission.getSourceCode(),
                "test_cases", testCases.stream().map(this::toJudgeTestCase).toList());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(buildUri("/submissions"))
                .timeout(Duration.ofMillis(judgeProperties.getMaxWaitMs()))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(writeJson(payload)))
                .build();

        JsonNode root = execute(request);
        String status = root.path("status").asText();
        if (!"queued".equalsIgnoreCase(status)) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge service rejected submission");
        }
    }

    private JudgeSubmissionStatusDto fetchStatus(Long submissionId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(buildUri("/submissions/" + submissionId))
                .timeout(Duration.ofMillis(judgeProperties.getMaxWaitMs()))
                .GET()
                .build();

        JsonNode root = execute(request);
        try {
            return objectMapper.treeToValue(root, JudgeSubmissionStatusDto.class);
        } catch (JsonProcessingException ex) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge status response parse failed");
        }
    }

    private JsonNode execute(HttpRequest request) {
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BusinessException(ResultCode.INTERNAL_ERROR,
                        "Judge service request failed: HTTP " + response.statusCode());
            }
            return objectMapper.readTree(response.body());
        } catch (IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new BusinessException(ResultCode.INTERNAL_ERROR,
                    "Judge service request failed: " + ex.getMessage());
        }
    }

    private Map<String, Object> toJudgeTestCase(TestCase testCase) {
        return Map.of(
                "case_id", String.valueOf(testCase.getId()),
                "input", testCase.getInputData() != null ? testCase.getInputData() : "",
                "expected_output", testCase.getExpectedOutput() != null ? testCase.getExpectedOutput() : "",
                "score", testCase.getScore() != null ? testCase.getScore() : 0);
    }

    private String normalizeLanguage(String languageCode) {
        String normalized = languageCode == null ? "" : languageCode.trim().toLowerCase();
        if (normalized.startsWith("cpp") || normalized.startsWith("c++")) {
            return "cpp";
        }
        if (normalized.startsWith("python")) {
            return "python";
        }
        throw new BusinessException(ResultCode.BAD_REQUEST, "Judge service does not support language: " + languageCode);
    }

    private String writeJson(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException ex) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge request serialize failed");
        }
    }

    private URI buildUri(String path) {
        String base = judgeProperties.getBaseUrl().replaceAll("/+$", "");
        return URI.create(base + path);
    }

    private void sleepPollInterval() {
        try {
            Thread.sleep(judgeProperties.getPollIntervalMs());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "Judge polling interrupted");
        }
    }
}
