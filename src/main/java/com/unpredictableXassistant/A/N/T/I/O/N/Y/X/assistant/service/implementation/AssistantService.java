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


    @Override
    public String chat(String prompt)
    {
        String output = chatClient.prompt()
                .user("Reply this in as short as possible and make sure the feel add dark humor , serious, a better personal assistant : "+prompt)
                .call()
                .content();

        return output;
    }
}
