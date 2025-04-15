package com.example.ihas.controllers;

import com.example.ihas.devices.SmartHub;
import com.example.ihas.services.SmartHubService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hubs")
public class SmartHubController {

    private final SmartHubService hubService;

    public SmartHubController(SmartHubService service) {
        hubService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllHubs(Authentication auth) {
        String userId = auth.getName();
        List<SmartHub> list = hubService.getAll(userId);
        List<Map<String, Object>> response = list.stream().map(hub -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", hub.getId());
            m.put("name", hub.getName());
            m.put("eventLogSize", hub.getEventLog().size());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getHub(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartHub hub = hubService.get(id, userId);
            Map<String, Object> result = new HashMap<>();
            result.put("id", hub.getId());
            result.put("name", hub.getName());
            result.put("eventLog", hub.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addHub(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartHub hub = new SmartHub(id, name);
            hubService.add(hub, userId);
            return ResponseEntity.ok("SmartHub added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHub(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            hubService.delete(id, userId);
            return ResponseEntity.ok("SmartHub deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> updateHub(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String name = body.get("name").toString();
            SmartHub hub = new SmartHub(id, name);
            hubService.update(hub, userId);
            return ResponseEntity.ok("SmartHub updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<String> toggleHub(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            hubService.togglePower(id, userId);
            return ResponseEntity.ok("SmartHub toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling SmartHub: " + e.getMessage());
        }
    }
}
