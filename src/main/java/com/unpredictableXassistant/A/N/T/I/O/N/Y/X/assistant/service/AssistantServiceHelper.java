package com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.service;

import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantRequestDTO;
import com.unpredictableXassistant.A.N.T.I.O.N.Y.X.assistant.dtos.AssistantResponseDTO;

public interface AssistantServiceHelper
{
    AssistantResponseDTO chat(AssistantRequestDTO requestDTO);
}
