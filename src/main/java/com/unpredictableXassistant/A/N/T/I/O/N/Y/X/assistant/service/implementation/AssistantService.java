package com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.implementation;

import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantRequestDTO;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantResponseDTO;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.mapper.AssistantMapper;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.AssistantServiceHelper;
import lombok.AllArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AssistantService implements AssistantServiceHelper
{
    private final ChatClient chatClient;
    private final AssistantMapper mapper;

    @Override
    public AssistantResponseDTO chat(AssistantRequestDTO requestDTO)
    {
        String output = chatClient.prompt()
                .user("Reply this in as short as possible : "+requestDTO)
                .call()
                .content();

        return mapper.toResponse(output);
    }
}
