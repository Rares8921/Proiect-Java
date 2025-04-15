package com.example.ihas.services;

import com.example.ihas.dao.SmartSensorDAO;
import com.example.ihas.devices.SmartSensor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SmartSensorService {

    private final SmartSensorDAO dao;

    public SmartSensorService(SmartSensorDAO _dao) {
        dao = _dao;
    }

    public SmartSensor getSensor(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartSensor> getAllSensors(String userId) {
        return dao.findAllByUser(userId);
    }

    public void addSensor(SmartSensor sensor, String userId) {
        dao.save(sensor, userId);
    }

    public void deleteSensor(String id, String userId) {
        dao.delete(id, userId);
    }

    public void updateReading(String id, double reading, String userId) {
        SmartSensor sensor = dao.findById(id, userId);
        sensor.setLastReading(reading);
        dao.update(sensor, userId);
    }
}
