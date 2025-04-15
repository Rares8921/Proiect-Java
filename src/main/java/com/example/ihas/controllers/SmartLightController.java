package com.example.ihas.controllers;

import com.example.ihas.devices.SmartLight;
import com.example.ihas.services.SmartLightService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lights")
public class SmartLightController {

    private final SmartLightService lightService;

    public SmartLightController(SmartLightService service) {
        lightService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllLights(Authentication auth) {
        String userId = auth.getName();
        List<SmartLight> list = lightService.getAll(userId);
        List<Map<String, Object>> response = list.stream().map(this::mapping).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapping(SmartLight light) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", light.getId());
        m.put("name", light.getName());
        m.put("isOn", light.isOn());
        m.put("brightness", light.getBrightness());
        m.put("color", light.getColor());
        return m;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getLight(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartLight light = lightService.get(id, userId);
            Map<String, Object> result = mapping(light);
            result.put("eventLog", light.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addLight(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartLight light = new SmartLight(id, name);
            lightService.add(light, userId);
            return ResponseEntity.ok("SmartLight added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLight(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            lightService.delete(id, userId);
            return ResponseEntity.ok("SmartLight deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<String> toggleLight(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            lightService.togglePower(id, userId);
            return ResponseEntity.ok("SmartLight toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling SmartLight: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/updateBrightness")
    public ResponseEntity<String> updateBrightness(@PathVariable String id, @RequestParam int brightness, Authentication auth) {
        try {
            String userId = auth.getName();
            lightService.updateBrightness(id, brightness, userId);
            return ResponseEntity.ok("Brightness updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating brightness: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/updateColor")
    public ResponseEntity<String> updateColor(@PathVariable String id, @RequestParam String color, Authentication auth) {
        try {
            String userId = auth.getName();
            lightService.updateColor(id, color, userId);
            return ResponseEntity.ok("Color updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating color: " + e.getMessage());
        }
    }
}
