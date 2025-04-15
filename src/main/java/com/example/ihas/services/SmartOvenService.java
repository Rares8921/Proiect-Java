package com.example.ihas.services;

import com.example.ihas.dao.SmartOvenDAO;
import com.example.ihas.devices.SmartOven;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartOvenService {

    private final SmartOvenDAO ovenDAO;
    private final ThingsBoardService thingsBoardService;
    private final String thingsBoardBaseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartOvenService(SmartOvenDAO dao, ThingsBoardService tbService) {
        ovenDAO = dao;
        thingsBoardService = tbService;
    }

    public SmartOven getOven(String id, String userId) {
        return ovenDAO.findById(id, userId);
    }

    public List<SmartOven> getAllOvens(String userId) {
        return ovenDAO.findAll(userId);
    }

    public void addOven(SmartOven oven, String userId) {
        ovenDAO.save(oven, userId);
        updateTelemetry(oven);
    }

    public void deleteOven(String id, String userId) {
        ovenDAO.delete(id, userId);
    }

    public void updateOven(SmartOven oven, String userId) {
        ovenDAO.update(oven, userId);
        updateTelemetry(oven);
    }

    public void toggleOven(String id, String userId) {
        SmartOven oven = ovenDAO.findById(id, userId);
        oven.togglePower();
        ovenDAO.update(oven, userId);
        updateTelemetry(oven);
    }

    public void updateTemperature(String id, double temperature, String userId) {
        SmartOven oven = ovenDAO.findById(id, userId);
        oven.setTemperature(temperature);
        ovenDAO.update(oven, userId);
        updateTelemetry(oven);
    }

    public void updateTimer(String id, int timer, String userId) {
        SmartOven oven = ovenDAO.findById(id, userId);
        oven.setTimer(timer);
        ovenDAO.update(oven, userId);
        updateTelemetry(oven);
    }

    public void setPreheat(String id, boolean preheat, String userId) {
        SmartOven oven = ovenDAO.findById(id, userId);
        if (preheat) {
            oven.preheat();
        } else {
            oven.cancelPreheat();
        }
        ovenDAO.update(oven, userId);
        updateTelemetry(oven);
    }

    public void togglePower(String id, String userId) {
        SmartOven oven = ovenDAO.findById(id, userId);
        oven.togglePower();
        ovenDAO.update(oven, userId);
    }


    private void updateTelemetry(SmartOven oven) {
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("isOn", oven.isOnline());
        telemetry.put("temperature", oven.getTemperature());
        telemetry.put("timer", oven.getTimer());
        telemetry.put("preheat", oven.isPreheat());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, oven.getId(), telemetry);
    }
}
