package com.example.ihas.services;

import com.example.ihas.dao.SmartDoorLockDAO;
import com.example.ihas.devices.SmartDoorLock;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartDoorLockService {

    private final SmartDoorLockDAO dao;
    private final ThingsBoardService tbService;
    private final String baseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartDoorLockService(SmartDoorLockDAO _dao, ThingsBoardService _tbService) {
        dao = _dao;
        tbService = _tbService;
    }

    public SmartDoorLock get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartDoorLock> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartDoorLock lock, String userId) {
        dao.save(lock, userId);
        updateTelemetry(lock);
    }

    public void update(SmartDoorLock lock, String userId) {
        dao.update(lock, userId);
        updateTelemetry(lock);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void toggleDoorLock(String id, String userId) {
        SmartDoorLock lock = dao.findById(id, userId);
        lock.togglePower();
        dao.update(lock, userId);
    }


    private void updateTelemetry(SmartDoorLock l) {
        Map<String, Object> t = new HashMap<>();
        t.put("locked", l.isLocked());
        tbService.updateTelemetry(baseUrl, l.getId(), t);
    }
}
