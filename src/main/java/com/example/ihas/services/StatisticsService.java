package com.example.ihas.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, Object> getStatistics(String userId) {
        Map<String, Object> stats = new HashMap<>();

        int thermostatTotal = count("smart_thermostat", userId);
        int lightTotal = count("smart_lights", userId);
        int ovenTotal = count("smart_oven", userId);
        int alarmTotal = count("smart_alarm_system", userId);
        int assistantTotal = count("smart_assistant", userId);
        int hubTotal = count("smart_hub", userId);
        int doorLockTotal = count("smart_door_lock", userId);
        int plugTotal = count("smart_plug", userId);
        int carChargerTotal = count("smart_car_charger", userId);
        int cameraTotal = count("smart_camera", userId);
        int curtainTotal = count("smart_curtains", userId);
        int fridgeTotal = count("smart_refrigerator", userId);
        int sprinklerTotal = count("smart_sprinkler", userId);
        int sensorTotal = count("smart_sensor", userId);

        int totalDevices = thermostatTotal + lightTotal + ovenTotal + alarmTotal + assistantTotal + hubTotal +
                doorLockTotal + plugTotal + carChargerTotal + cameraTotal + curtainTotal + fridgeTotal + sprinklerTotal + sensorTotal;

        int thermostatOnline = countOnline("smart_thermostat", "is_on", userId);
        int lightOnline = countOnline("smart_lights", "is_on", userId);
        int ovenOnline = countOnline("smart_oven", "is_on", userId);
        int alarmOnline = countOnline("smart_alarm_system", "is_armed", userId);
        int doorLockOnline = countOnline("smart_door_lock", "locked", userId);
        int plugOnline = countOnline("smart_plug", "is_on", userId);
        int chargerOnline = countOnline("smart_car_charger", "is_charging", userId);
        int cameraOnline = countOnline("smart_camera", "is_recording", userId);
        int sprinklerOnline = countOnline("smart_sprinkler", "is_on", userId);

        int onlineDevices = thermostatOnline + lightOnline + ovenOnline + alarmOnline +
                plugOnline + chargerOnline + cameraOnline + sprinklerOnline + assistantTotal + hubTotal;

        stats.put("totalDevices", totalDevices);
        stats.put("onlineDevices", onlineDevices);

        return stats;
    }

    private int count(String table, String userId) {
        String sql = "SELECT COUNT(*) FROM " + table + " WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }

    private int countOnline(String table, String column, String userId) {
        String sql = "SELECT COUNT(*) FROM " + table + " WHERE " + column + " = true AND user_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, userId);
    }
}
