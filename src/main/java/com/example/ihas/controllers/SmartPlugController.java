package com.example.ihas.controllers;

import com.example.ihas.devices.SmartPlug;
import com.example.ihas.services.SmartPlugService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/smartplugs")
public class SmartPlugController {

    private final SmartPlugService plugService;

    public SmartPlugController(SmartPlugService service) {
        plugService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSmartPlugs(Authentication auth) {
        String userId = auth.getName();
        List<SmartPlug> list = plugService.getAllSmartPlugs(userId);
        List<Map<String, Object>> response = list.stream().map(this::mapping).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSmartPlug(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartPlug plug = plugService.getSmartPlug(id, userId);
            return ResponseEntity.ok(mapping(plug));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Map<String, Object> mapping(SmartPlug plug) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", plug.getId());
        result.put("name", plug.getName());
        result.put("isOn", plug.isOn());
        result.put("currentConsumption", plug.getCurrentConsumption());
        result.put("eventLog", plug.getEventLog());
        return result;
    }

    @PostMapping
    public ResponseEntity<String> addSmartPlug(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartPlug plug = new SmartPlug(id, name);
            plugService.addSmartPlug(plug, userId);
            return ResponseEntity.ok("SmartPlug added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSmartPlug(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            plugService.deleteSmartPlug(id, userId);
            return ResponseEntity.ok("SmartPlug deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<String> toggleSmartPlug(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            plugService.toggleSmartPlug(id, userId);
            return ResponseEntity.ok("SmartPlug toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling SmartPlug: " + e.getMessage());
        }
    }
}
