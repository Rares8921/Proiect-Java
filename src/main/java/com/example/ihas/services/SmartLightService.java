package com.example.ihas.services;

import com.example.ihas.dao.SmartLightDAO;
import com.example.ihas.devices.SmartLight;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartLightService {

    private final SmartLightDAO dao;
    private final ThingsBoardService tbService;
    private final String baseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartLightService(SmartLightDAO _dao, ThingsBoardService _tbService) {
        dao = _dao;
        tbService = _tbService;
    }

    public SmartLight get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartLight> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartLight light, String userId) {
        dao.save(light, userId);
        updateTelemetry(light);
    }

    public void update(SmartLight light, String userId) {
        dao.update(light, userId);
        updateTelemetry(light);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void togglePower(String id, String userId) {
        SmartLight light = dao.findById(id, userId);
        light.togglePower();
        dao.update(light, userId);
    }

    public void updateBrightness(String id, int brightness, String userId) {
        SmartLight light = dao.findById(id, userId);
        light.setBrightness(brightness);
        dao.update(light, userId);
    }

    public void updateColor(String id, String color, String userId) {
        SmartLight light = dao.findById(id, userId);
        light.setColor(color);
        dao.update(light, userId);
    }


    private void updateTelemetry(SmartLight l) {
        Map<String, Object> t = new HashMap<>();
        t.put("isOn", l.isOn());
        t.put("brightness", l.getBrightness());
        t.put("color", l.getColor());
        tbService.updateTelemetry(baseUrl, l.getId(), t);
    }
}
