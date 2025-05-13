package com.example.ihas.controllers;

import com.example.ihas.devices.SmartSprinkler;
import com.example.ihas.services.SmartSprinklerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sprinklers")
public class SmartSprinklerController {

    private final SmartSprinklerService sprinklerService;

    public SmartSprinklerController(SmartSprinklerService service) {
        sprinklerService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSprinklers(Authentication auth) {
        String user_id = auth.getName();
        List<SmartSprinkler> list = sprinklerService.getAllSprinklers(user_id);
        List<Map<String, Object>> response = list.stream().map(this::mapping).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapping(SmartSprinkler sprinkler) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", sprinkler.getId());
        m.put("name", sprinkler.getName());
        m.put("isOn", sprinkler.isOn());
        m.put("wateringDuration", sprinkler.getWateringDuration());
        return m;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSprinkler(@PathVariable String id, Authentication auth) {
        try {
            String user_id = auth.getName();
            SmartSprinkler sprinkler = sprinklerService.getSprinkler(id, user_id);
            Map<String, Object> result = mapping(sprinkler);
            result.put("eventLog", sprinkler.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addSprinkler(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String user_id = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartSprinkler sprinkler = new SmartSprinkler(id, name);
            if (body.containsKey("wateringDuration")) {
                int duration = Integer.parseInt(body.get("wateringDuration").toString());
                sprinkler.setWateringDuration(duration);
            }
            sprinklerService.addSprinkler(sprinkler, user_id);
            return ResponseEntity.ok("SmartSprinkler added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSprinkler(@PathVariable String id, Authentication auth) {
        try {
            String user_id = auth.getName();
            sprinklerService.deleteSprinkler(id, user_id);
            return ResponseEntity.ok("SmartSprinkler deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<String> toggleSprinkler(@PathVariable String id, Authentication auth) {
        try {
            String user_id = auth.getName();
            sprinklerService.togglePower(id, user_id);
            return ResponseEntity.ok("SmartSprinkler toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling SmartSprinkler: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/updateDuration")
    public ResponseEntity<String> updateWateringDuration(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String user_id = auth.getName();
            if (body.containsKey("wateringDuration")) {
                int duration = Integer.parseInt(body.get("wateringDuration").toString());
                sprinklerService.updateWateringDuration(id, duration, user_id);
                return ResponseEntity.ok("Watering duration updated");
            } else {
                return ResponseEntity.badRequest().body("Watering duration is required");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
