package com.example.ihas.services;

import com.example.ihas.dao.SmartSprinklerDAO;
import com.example.ihas.devices.SmartSprinkler;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartSprinklerService {

    private final SmartSprinklerDAO dao;
    private final ThingsBoardService thingsBoardService;

    public SmartSprinklerService(SmartSprinklerDAO _dao, ThingsBoardService _thingsBoardService) {
        dao = _dao;
        thingsBoardService = _thingsBoardService;
    }

    public SmartSprinkler getSprinkler(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartSprinkler> getAllSprinklers(String userId) {
        return dao.findAllByUser(userId);
    }

    public void addSprinkler(SmartSprinkler sprinkler, String userId) {
        dao.save(sprinkler, userId);
    }

    public void deleteSprinkler(String id, String userId) {
        dao.delete(id, userId);
    }

    public void setDuration(String id, int duration, String userId) {
        SmartSprinkler sprinkler = dao.findById(id, userId);
        sprinkler.setWateringDuration(duration);
        dao.update(sprinkler, userId);
    }

    public void togglePower(String id, String userId) {
        SmartSprinkler sprinkler = dao.findById(id, userId);
        sprinkler.togglePower();
        dao.update(sprinkler, userId);
    }

    public void updateWateringDuration(String id, int duration, String userId) {
        SmartSprinkler sprinkler = dao.findById(id, userId);
        sprinkler.setWateringDuration(duration);
        dao.update(sprinkler, userId);

        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("wateringDuration", duration);
        thingsBoardService.updateTelemetry("https://eu.thingsboard.cloud/api/v1/", id, telemetry);
    }

}
