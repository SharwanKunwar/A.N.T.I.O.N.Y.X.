package com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.controller;

import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantRequestDTO;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantResponseDTO;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.AssistantServiceHelper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
@AllArgsConstructor
public class AssistantController
{
    private final AssistantServiceHelper service;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody String prompt)
    {
        return ResponseEntity.ok(service.chat(prompt));
    }
}
