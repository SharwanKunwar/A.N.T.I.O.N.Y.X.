package com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.implementation;


import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.AssistantServiceHelper;
import lombok.AllArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AssistantService implements AssistantServiceHelper
{
    private final ChatClient chatClient;
    private List<Message> historyMessages = new ArrayList<>();

    @Override
    public String chat(String prompt)
    {
        historyMessages.add(new UserMessage(prompt));

        String output = chatClient.prompt()
                .messages(historyMessages)
                .call()
                .content();

        historyMessages.add(new AssistantMessage(output));

        System.out.println(output);
        return output;
    }
}
