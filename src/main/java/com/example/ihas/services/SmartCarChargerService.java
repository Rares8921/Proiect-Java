package com.example.ihas.services;

import com.example.ihas.dao.SmartCarChargerDAO;
import com.example.ihas.devices.SmartCarCharger;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartCarChargerService {

    private final SmartCarChargerDAO dao;
    private final ThingsBoardService tbService;
    private final String baseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartCarChargerService(SmartCarChargerDAO _dao, ThingsBoardService _tbService) {
        dao = _dao;
        tbService = _tbService;
    }

    public SmartCarCharger get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartCarCharger> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartCarCharger charger, String userId) {
        dao.save(charger, userId);
        updateTelemetry(charger);
    }

    public void update(SmartCarCharger charger, String userId) {
        dao.update(charger, userId);
        updateTelemetry(charger);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void toggleCharging(String id, String userId) {
        SmartCarCharger charger = dao.findById(id, userId);
        charger.togglePower();
        dao.update(charger, userId);
    }


    private void updateTelemetry(SmartCarCharger ch) {
        Map<String, Object> t = new HashMap<>();
        t.put("isCharging", ch.isCharging());
        t.put("current", ch.getCurrent());
        t.put("voltage", ch.getVoltage());
        tbService.updateTelemetry(baseUrl, ch.getId(), t);
    }
}
