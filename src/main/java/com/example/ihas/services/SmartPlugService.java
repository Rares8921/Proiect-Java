package com.example.ihas.services;

import com.example.ihas.dao.SmartPlugDAO;
import com.example.ihas.devices.SmartPlug;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartPlugService {

    private final SmartPlugDAO plugDAO;
    private final ThingsBoardService thingsBoardService;
    private final String thingsBoardBaseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartPlugService(SmartPlugDAO dao, ThingsBoardService tbService) {
        plugDAO = dao;
        thingsBoardService = tbService;
    }

    public SmartPlug getSmartPlug(String id, String userId) {
        return plugDAO.findById(id, userId);
    }

    public List<SmartPlug> getAllSmartPlugs(String userId) {
        return plugDAO.findAllByUser(userId);
    }

    public void addSmartPlug(SmartPlug plug, String userId) {
        plugDAO.save(plug, userId);
        updateTelemetry(plug);
    }

    public void deleteSmartPlug(String id, String userId) {
        plugDAO.delete(id, userId);
    }

    public void toggleSmartPlug(String id, String userId) {
        SmartPlug plug = plugDAO.findById(id, userId);
        plug.togglePower();
        plugDAO.update(plug, userId);
        updateTelemetry(plug);
    }

    public void updateSmartPlug(SmartPlug plug, String userId) {
        plugDAO.update(plug, userId);
        updateTelemetry(plug);
    }

    private void updateTelemetry(SmartPlug plug) {
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("isOn", plug.isOn());
        telemetry.put("currentConsumption", plug.getCurrentConsumption());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, plug.getId(), telemetry);
    }
}
