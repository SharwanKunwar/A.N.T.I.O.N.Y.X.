package com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.implementation;


import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service.AssistantServiceHelper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AssistantService implements AssistantServiceHelper
{
    private final ChatClient chatClient;
    private List<Message> historyMessages = new ArrayList<>();

    @Value("${AI_SYSTEM_INSTRUCTION}")
    private String systemInstruction;

    public AssistantService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @Override
    public String chat(String prompt)
    {
        historyMessages.add(new UserMessage(prompt));
        String output = chatClient.prompt()
                .system(systemInstruction)
                .messages(historyMessages)
                .call()
                .content();
        historyMessages.add(new AssistantMessage(output));

        return output;
    }
}
