package com.example.ihas.services;

import com.example.ihas.dao.SmartCameraDAO;
import com.example.ihas.devices.SmartCamera;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SmartCameraService {

    private final SmartCameraDAO dao;
    private final ThingsBoardService tbService;
    private final String baseUrl = "https://eu.thingsboard.cloud/api/v1/";

    public SmartCameraService(SmartCameraDAO _dao, ThingsBoardService _tbService) {
        dao = _dao;
        tbService = _tbService;
    }

    public SmartCamera get(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartCamera> getAll(String userId) {
        return dao.findAll(userId);
    }

    public void add(SmartCamera camera, String userId) {
        dao.save(camera, userId);
        updateTelemetry(camera);
    }

    public void update(SmartCamera camera, String userId) {
        dao.update(camera, userId);
        updateTelemetry(camera);
    }

    public void delete(String id, String userId) {
        dao.delete(id, userId);
    }

    public void toggleRecording(String id, String email) {
        SmartCamera cam = get(id, email);
        cam.togglePower();
        dao.update(cam, email);
    }

    public void updateDetectionSensitivity(String id, int sensitivity, String email) {
        SmartCamera cam = get(id, email);
        cam.setDetectionSensitivity(sensitivity);
        dao.update(cam, email);
    }

    private void updateTelemetry(SmartCamera cam) {
        Map<String, Object> t = new HashMap<>();
        t.put("isRecording", cam.isRecording());
        t.put("resolution", cam.getResolution());
        t.put("detectionSensitivity", cam.getDetectionSensitivity());
        tbService.updateTelemetry(baseUrl, cam.getId(), t);
    }
}
