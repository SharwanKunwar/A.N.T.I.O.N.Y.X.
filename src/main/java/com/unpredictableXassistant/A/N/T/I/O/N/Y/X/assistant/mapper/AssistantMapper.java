package com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.mapper;

import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantRequestDTO;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AssistantMapper
{

    // DTO -> String
    public String toPrompt(AssistantRequestDTO requestDTO)
    {
        return requestDTO.getMessage();
    }

    // String -> Response DTO
    public AssistantResponseDTO toResponse(String response)
    {
        return AssistantResponseDTO.builder()
                .message(response)
                .build();
    }
}