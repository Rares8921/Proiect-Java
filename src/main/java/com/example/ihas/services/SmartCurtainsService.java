package com.example.ihas.services;

import com.example.ihas.dao.SmartCurtainsDAO;
import com.example.ihas.devices.SmartCurtains;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartCurtainsService {

    private final SmartCurtainsDAO dao;
    private final ThingsBoardService tbService;
    private final String baseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartCurtainsService(SmartCurtainsDAO _dao, ThingsBoardService _tbService) {
        dao = _dao;
        tbService = _tbService;
    }

    public SmartCurtains get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartCurtains> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartCurtains curtains, String userId) {
        dao.save(curtains, userId);
        updateTelemetry(curtains);
    }

    public void update(SmartCurtains curtains, String userId) {
        dao.update(curtains, userId);
        updateTelemetry(curtains);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void toggleCurtains(String id, String userId) {
        SmartCurtains curtains = dao.findById(id, userId);
        curtains.togglePower();
        dao.update(curtains, userId);
    }

    public void updatePosition(String id, int position, String userId) {
        SmartCurtains curtains = dao.findById(id, userId);
        curtains.setPosition(position);
        dao.update(curtains, userId);
    }


    private void updateTelemetry(SmartCurtains c) {
        Map<String, Object> t = new HashMap<>();
        t.put("position", c.getPosition());
        tbService.updateTelemetry(baseUrl, c.getId(), t);
    }
}
