package com.example.ihas.services;

import com.example.ihas.dao.SmartThermostatDAO;
import com.example.ihas.devices.SmartThermostat;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartThermostatService {

    private final SmartThermostatDAO thermostatDAO;
    private final ThingsBoardService thingsBoardService;
    private final String thingsBoardBaseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartThermostatService(SmartThermostatDAO dao, ThingsBoardService tbService) {
        thermostatDAO = dao;
        thingsBoardService = tbService;
    }

    public SmartThermostat getThermostat(String id, String userId) {
        return thermostatDAO.findById(id, userId);
    }

    public List<SmartThermostat> getAllThermostats(String userId) {
        return thermostatDAO.findAllByUser(userId);
    }

    public void addThermostat(SmartThermostat thermostat, String userId) {
        thermostatDAO.save(thermostat, userId);
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("temperature", thermostat.getTemperature());
        telemetry.put("mode", thermostat.getMode().name());
        telemetry.put("isOn", thermostat.isOn());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, thermostat.getId(), telemetry);
    }

    public void deleteThermostat(String id, String userId) {
        thermostatDAO.delete(id, userId);
    }

    public void updateTemperature(String id, double newTemp, String userId) {
        SmartThermostat st = thermostatDAO.findById(id, userId);
        st.setTemperature(newTemp);
        thermostatDAO.update(st, userId);
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("temperature", st.getTemperature());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, st.getId(), telemetry);
    }

    public void updateMode(String id, SmartThermostat.Mode mode, String userId) {
        SmartThermostat st = thermostatDAO.findById(id, userId);
        st.setMode(mode);
        thermostatDAO.update(st, userId);
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("mode", st.getMode().name());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, st.getId(), telemetry);
    }

    public void togglePower(String id, String userId) {
        SmartThermostat st = thermostatDAO.findById(id, userId);
        st.togglePower();
        thermostatDAO.update(st, userId);
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("isOn", st.isOn());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, st.getId(), telemetry);
    }

    public void autoAdjust(String id, double ambientTemp, String userId) {
        SmartThermostat st = thermostatDAO.findById(id, userId);
        st.autoAdjustTemperature(ambientTemp);
        thermostatDAO.update(st, userId);
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("temperature", st.getTemperature());
        telemetry.put("mode", st.getMode().name());
        thingsBoardService.updateTelemetry(thingsBoardBaseUrl, st.getId(), telemetry);
    }
}
