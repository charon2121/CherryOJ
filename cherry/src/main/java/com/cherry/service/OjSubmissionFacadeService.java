package com.cherry.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.context.UserContext;
import com.cherry.mapper.LanguageMapper;
import com.cherry.mapper.ProblemMapper;
import com.cherry.mapper.SubmissionMapper;
import com.cherry.mapper.SubmissionTestCaseResultMapper;
import com.cherry.mapper.TestCaseMapper;
import com.cherry.model.dto.judge.JudgeCompileResultDto;
import com.cherry.model.dto.judge.JudgeResultDto;
import com.cherry.model.dto.judge.JudgeRunResultDto;
import com.cherry.model.dto.submission.CreateSubmissionRequest;
import com.cherry.model.dto.submission.CreateSubmissionResponse;
import com.cherry.model.dto.submission.SubmissionCaseResultDto;
import com.cherry.model.dto.submission.SubmissionDetailDto;
import com.cherry.model.entity.Language;
import com.cherry.model.entity.Problem;
import com.cherry.model.entity.Submission;
import com.cherry.model.entity.SubmissionTestCaseResult;
import com.cherry.model.entity.TestCase;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OjSubmissionFacadeService {

    private static final int PROBLEM_STATUS_PUBLISHED = 1;
    private static final int SUBMISSION_STATUS_PENDING = 1;
    private static final int SUBMISSION_STATUS_FINISHED = 3;
    private static final int SUBMISSION_STATUS_SYSTEM_ERROR = 4;
    private static final int ACTIVE_TEST_CASE_STATUS = 1;

    private final SubmissionMapper submissionMapper;
    private final SubmissionTestCaseResultMapper submissionTestCaseResultMapper;
    private final ProblemMapper problemMapper;
    private final LanguageMapper languageMapper;
    private final TestCaseMapper testCaseMapper;
    private final UserContext userContext;
    private final JudgeClientService judgeClientService;

    @Transactional
    public CreateSubmissionResponse createSubmission(CreateSubmissionRequest request) {
        Long userId = userContext.getUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        if (request.getProblemId() == null) {
            throw new IllegalArgumentException("problemId 不能为空");
        }
        if (request.getLanguageCode() == null || request.getLanguageCode().isBlank()) {
            throw new IllegalArgumentException("languageCode 不能为空");
        }
        String sourceCode = request.getSourceCode() != null ? request.getSourceCode() : "";
        if (sourceCode.isBlank()) {
            throw new IllegalArgumentException("sourceCode 不能为空");
        }

        Problem problem = problemMapper.selectPublishedById(request.getProblemId(), PROBLEM_STATUS_PUBLISHED);
        if (problem == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "题目不存在或未发布");
        }

        Language language = languageMapper.selectByCode(request.getLanguageCode().trim());
        if (language == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "不支持的语言: " + request.getLanguageCode());
        }

        Submission submission = new Submission();
        submission.setUserId(userId);
        submission.setProblemId(problem.getId());
        submission.setLanguageId(language.getId());
        submission.setSubmitMode(problem.getJudgeMode());
        submission.setSourceCode(sourceCode);
        submission.setStatus(SUBMISSION_STATUS_PENDING);
        submission.setResultCode(null);
        submission.setScore(0);
        submission.setTimeUsedMs(null);
        submission.setMemoryUsedKb(null);
        submission.setCodeLength(sourceCode.length());
        submission.setJudgedAt(null);
        submissionMapper.insert(submission);
        List<TestCase> activeTestCases =
                testCaseMapper.selectActiveByProblemId(submission.getProblemId(), ACTIVE_TEST_CASE_STATUS);
        if (activeTestCases.isEmpty()) {
            finalizeWithoutJudgeService(submission, null);
        } else {
            submission.setStatus(2);
            submissionMapper.updateById(submission);
            try {
                JudgeResultDto judgeResult =
                        judgeClientService.judge(submission, problem, language.getCode(), activeTestCases);
                finalizeWithJudgeResult(submission, activeTestCases, judgeResult);
            } catch (RuntimeException ex) {
                finalizeWithoutJudgeService(submission, ex.getMessage());
            }
        }

        Submission finalized = submissionMapper.selectById(submission.getId());
        return CreateSubmissionResponse.builder()
                .submissionId(finalized.getId())
                .status(toSubmissionStatus(finalized.getStatus()))
                .resultCode(finalized.getResultCode())
                .build();
    }

    @Transactional(readOnly = true)
    public SubmissionDetailDto getSubmission(long submissionId) {
        Long userId = userContext.getUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }

        Submission submission = submissionMapper.selectById(submissionId);
        if (submission == null || !userId.equals(submission.getUserId())) {
            throw new BusinessException(ResultCode.NOT_FOUND, "提交记录不存在");
        }

        Language language = languageMapper.selectById(submission.getLanguageId());
        List<SubmissionTestCaseResult> caseResults = submissionTestCaseResultMapper.selectBySubmissionId(submissionId);
        int passedCases = (int) caseResults.stream()
                .filter(result -> "AC".equalsIgnoreCase(result.getResultCode()))
                .count();

        return SubmissionDetailDto.builder()
                .id(submission.getId())
                .userId(submission.getUserId())
                .problemId(submission.getProblemId())
                .languageId(submission.getLanguageId())
                .languageCode(language != null ? language.getCode() : null)
                .status(toSubmissionStatus(submission.getStatus()))
                .resultCode(submission.getResultCode())
                .score(submission.getScore())
                .timeUsedMs(submission.getTimeUsedMs())
                .memoryUsedKb(submission.getMemoryUsedKb())
                .codeLength(submission.getCodeLength())
                .passedCases(passedCases)
                .totalCases(caseResults.size())
                .message(extractMessage(caseResults))
                .judgedAt(submission.getJudgedAt())
                .createdAt(submission.getCreatedAt())
                .testCaseResults(caseResults.stream().map(this::toCaseResultDto).toList())
                .build();
    }

    private void finalizeWithoutJudgeService(Submission submission, String overrideMessage) {
        List<TestCase> activeTestCases =
                testCaseMapper.selectActiveByProblemId(submission.getProblemId(), ACTIVE_TEST_CASE_STATUS);
        String message = overrideMessage != null && !overrideMessage.isBlank()
                ? overrideMessage
                : "Judge service is not connected yet";

        if (activeTestCases.isEmpty()) {
            submission.setStatus(SUBMISSION_STATUS_SYSTEM_ERROR);
            submission.setResultCode("SYSTEM_ERROR");
            submission.setJudgedAt(LocalDateTime.now());
            submissionMapper.updateById(submission);
            return;
        }

        for (TestCase testCase : activeTestCases) {
            SubmissionTestCaseResult result = new SubmissionTestCaseResult();
            result.setSubmissionId(submission.getId());
            result.setTestCaseId(testCase.getId());
            result.setCaseNo(testCase.getCaseNo());
            result.setResultCode("SYSTEM_ERROR");
            result.setTimeUsedMs(null);
            result.setMemoryUsedKb(null);
            result.setMessage(message);
            submissionTestCaseResultMapper.insert(result);
        }

        submission.setStatus(SUBMISSION_STATUS_FINISHED);
        submission.setResultCode("SYSTEM_ERROR");
        submission.setScore(0);
        submission.setTimeUsedMs(null);
        submission.setMemoryUsedKb(null);
        submission.setJudgedAt(LocalDateTime.now());
        submissionMapper.updateById(submission);
    }

    private void finalizeWithJudgeResult(Submission submission, List<TestCase> activeTestCases, JudgeResultDto judgeResult) {
        Map<String, TestCase> testCaseById = activeTestCases.stream()
                .collect(Collectors.toMap(testCase -> String.valueOf(testCase.getId()), Function.identity()));

        List<JudgeRunResultDto> runResults = judgeResult.getRunResults() != null ? judgeResult.getRunResults() : List.of();
        for (JudgeRunResultDto runResult : runResults) {
            TestCase testCase = testCaseById.get(runResult.getCaseId());
            if (testCase == null) {
                continue;
            }
            SubmissionTestCaseResult result = new SubmissionTestCaseResult();
            result.setSubmissionId(submission.getId());
            result.setTestCaseId(testCase.getId());
            result.setCaseNo(testCase.getCaseNo());
            result.setResultCode(normalizeVerdict(runResult.getVerdict()));
            result.setTimeUsedMs(runResult.getTimeMs());
            result.setMemoryUsedKb(runResult.getMemoryKb());
            result.setMessage(composeRunMessage(runResult));
            submissionTestCaseResultMapper.insert(result);
        }

        submission.setStatus(SUBMISSION_STATUS_FINISHED);
        submission.setResultCode(normalizeVerdict(judgeResult.getFinalVerdict()));
        submission.setScore(calculateScore(judgeResult));
        submission.setTimeUsedMs(judgeResult.getTotalTimeMs());
        submission.setMemoryUsedKb(judgeResult.getPeakMemoryKb());
        submission.setJudgedAt(LocalDateTime.now());
        submissionMapper.updateById(submission);

        if (runResults.isEmpty()) {
            for (TestCase testCase : activeTestCases) {
                SubmissionTestCaseResult result = new SubmissionTestCaseResult();
                result.setSubmissionId(submission.getId());
                result.setTestCaseId(testCase.getId());
                result.setCaseNo(testCase.getCaseNo());
                result.setResultCode(normalizeVerdict(judgeResult.getFinalVerdict()));
                result.setTimeUsedMs(null);
                result.setMemoryUsedKb(null);
                result.setMessage(composeFallbackMessage(judgeResult));
                submissionTestCaseResultMapper.insert(result);
            }
        }
    }

    private SubmissionCaseResultDto toCaseResultDto(SubmissionTestCaseResult result) {
        return SubmissionCaseResultDto.builder()
                .caseNo(result.getCaseNo())
                .resultCode(result.getResultCode())
                .timeUsedMs(result.getTimeUsedMs())
                .memoryUsedKb(result.getMemoryUsedKb())
                .message(result.getMessage())
                .build();
    }

    private String extractMessage(List<SubmissionTestCaseResult> caseResults) {
        return caseResults.stream()
                .map(SubmissionTestCaseResult::getMessage)
                .filter(message -> message != null && !message.isBlank())
                .findFirst()
                .orElse(null);
    }

    private String toSubmissionStatus(Integer status) {
        if (status == null) {
            return "UNKNOWN";
        }
        return switch (status) {
            case SUBMISSION_STATUS_PENDING -> "PENDING";
            case 2 -> "JUDGING";
            case SUBMISSION_STATUS_FINISHED -> "FINISHED";
            case SUBMISSION_STATUS_SYSTEM_ERROR -> "SYSTEM_ERROR";
            default -> "UNKNOWN";
        };
    }

    private String normalizeVerdict(String verdict) {
        if (verdict == null || verdict.isBlank()) {
            return "SYSTEM_ERROR";
        }
        return switch (verdict) {
            case "SE" -> "SYSTEM_ERROR";
            default -> verdict;
        };
    }

    private String composeRunMessage(JudgeRunResultDto runResult) {
        if (runResult.getStderrText() != null && !runResult.getStderrText().isBlank()) {
            return runResult.getStderrText();
        }
        if (runResult.getStdoutText() != null && !runResult.getStdoutText().isBlank()
                && !"AC".equalsIgnoreCase(runResult.getVerdict())) {
            return runResult.getStdoutText();
        }
        return null;
    }

    private String composeFallbackMessage(JudgeResultDto judgeResult) {
        JudgeCompileResultDto compileResult = judgeResult.getCompileResult();
        if (compileResult != null && compileResult.getStderrText() != null && !compileResult.getStderrText().isBlank()) {
            return compileResult.getStderrText();
        }
        return judgeResult.getMessage();
    }

    private Integer calculateScore(JudgeResultDto judgeResult) {
        Integer passed = judgeResult.getPassedCases();
        Integer total = judgeResult.getTotalCases();
        if (passed == null || total == null || total <= 0) {
            return 0;
        }
        if (passed.equals(total)) {
            return 100;
        }
        return (int) Math.floor((passed * 100.0) / total);
    }
}
