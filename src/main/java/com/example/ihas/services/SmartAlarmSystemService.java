package com.example.ihas.services;

import com.example.ihas.dao.SmartAlarmSystemDAO;
import com.example.ihas.devices.SmartAlarmSystem;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartAlarmSystemService {

    private final SmartAlarmSystemDAO dao;
    private final ThingsBoardService tbService;
    private final String baseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartAlarmSystemService(SmartAlarmSystemDAO _dao, ThingsBoardService _tbService) {
        dao = _dao;
        tbService = _tbService;
    }

    public SmartAlarmSystem get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartAlarmSystem> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartAlarmSystem alarm, String userId) {
        dao.save(alarm, userId);
        updateTelemetry(alarm);
    }

    public void update(SmartAlarmSystem alarm, String userId) {
        dao.update(alarm, userId);
        updateTelemetry(alarm);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void armAlarmSystem(String id, String userId) {
        SmartAlarmSystem alarm = get(id, userId);
        alarm.arm();
        dao.update(alarm, userId);
    }

    public void disarmAlarmSystem(String id, String userId) {
        SmartAlarmSystem alarm = get(id, userId);
        alarm.disarm();
        dao.update(alarm, userId);
    }

    public void triggerAlarm(String id, String userId) {
        SmartAlarmSystem alarm = get(id, userId);
        alarm.triggerAlarm();
        dao.update(alarm, userId);
    }

    private void updateTelemetry(SmartAlarmSystem a) {
        Map<String, Object> t = new HashMap<>();
        t.put("isArmed", a.isArmed());
        t.put("alarmTriggered", a.isAlarmTriggered());
        tbService.updateTelemetry(baseUrl, a.getId(), t);
    }
}
