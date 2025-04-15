package com.example.ihas.services;

import com.example.ihas.dao.SmartAssistantDAO;
import com.example.ihas.dao.SmartHubDAO;
import com.example.ihas.devices.SmartAssistant;
import com.example.ihas.devices.SmartHub;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SmartAssistantService {

    private final SmartAssistantDAO dao;
    private final SmartHubDAO hubDao;

    public SmartAssistantService(SmartAssistantDAO _dao, SmartHubDAO _hubDao) {
        dao = _dao;
        hubDao = _hubDao;
    }

    public SmartAssistant get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartAssistant> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartAssistant assistant, String userId) {
        dao.save(assistant, userId);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void update(SmartAssistant assistant, String userId) {
        dao.update(assistant, userId);
    }

    public void processVoiceCommand(String assistantId, String command, String userId) {
        SmartAssistant assistant = dao.findById(assistantId, userId);
        SmartHub hub = hubDao.findById(assistant.getHubId(), userId);
        assistant.processVoiceCommand(command, hub);
        dao.update(assistant, userId);
    }

}
