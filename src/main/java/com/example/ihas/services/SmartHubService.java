package com.example.ihas.services;

import com.example.ihas.dao.SmartHubDAO;
import com.example.ihas.devices.SmartHub;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SmartHubService {

    private final SmartHubDAO dao;

    public SmartHubService(SmartHubDAO _dao) {
        dao = _dao;
    }

    public SmartHub get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartHub> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartHub hub, String userId) {
        dao.save(hub, userId);
    }

    public void update(SmartHub hub, String userId) {
        dao.update(hub, userId);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void togglePower(String id, String userId) {
        SmartHub hub = dao.findById(id, userId);
        hub.togglePower();
        dao.update(hub, userId);
    }

}
