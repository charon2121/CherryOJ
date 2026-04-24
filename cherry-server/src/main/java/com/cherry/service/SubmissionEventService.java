package com.cherry.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.cherry.model.dto.submission.SubmissionEventDto;

@Service
public class SubmissionEventService {

    private static final long SSE_TIMEOUT_MS = 30 * 60 * 1000L;

    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> emittersBySubmission = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long submissionId, SubmissionEventDto snapshot) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT_MS);
        emittersBySubmission.computeIfAbsent(submissionId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> remove(submissionId, emitter));
        emitter.onTimeout(() -> remove(submissionId, emitter));
        emitter.onError(ignored -> remove(submissionId, emitter));

        sendToEmitter(submissionId, emitter, "submission.snapshot", snapshot);
        return emitter;
    }

    public void publishUpdated(SubmissionEventDto event) {
        publish(event.getSubmissionId(), "submission.updated", event);
    }

    public void publishError(SubmissionEventDto event) {
        publish(event.getSubmissionId(), "submission.error", event);
    }

    private void publish(Long submissionId, String eventName, SubmissionEventDto event) {
        List<SseEmitter> emitters = emittersBySubmission.get(submissionId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }
        for (SseEmitter emitter : emitters) {
            sendToEmitter(submissionId, emitter, eventName, event);
        }
    }

    private void sendToEmitter(Long submissionId, SseEmitter emitter, String eventName, Object data) {
        try {
            emitter.send(SseEmitter.event().name(eventName).data(data));
        } catch (IOException | IllegalStateException ex) {
            remove(submissionId, emitter);
        }
    }

    private void remove(Long submissionId, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersBySubmission.get(submissionId);
        if (emitters == null) {
            return;
        }
        emitters.remove(emitter);
        if (emitters.isEmpty()) {
            emittersBySubmission.remove(submissionId);
        }
    }
}
