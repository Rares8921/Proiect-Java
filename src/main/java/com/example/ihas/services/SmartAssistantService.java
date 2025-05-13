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

    public SmartAssistant get(String id, String user_id) {
        return dao.findById(id, user_id);
    }

    public List<SmartAssistant> getAll(String user_id) {
        return dao.findAll(user_id);
    }

    public void add(SmartAssistant assistant, String user_id) {
        dao.save(assistant, user_id);
    }

    public void delete(String id, String user_id) {
        dao.delete(id, user_id);
    }

    public void update(SmartAssistant assistant, String user_id) {
        dao.update(assistant, user_id);
    }

    public void processVoiceCommand(String assistantId, String command, String user_id) {
        SmartAssistant assistant = dao.findById(assistantId, user_id);
        SmartHub hub = hubDao.findById(assistant.getHubId(), user_id);
        assistant.processVoiceCommand(command, hub);
        dao.update(assistant, user_id);
    }

}
