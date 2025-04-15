package com.example.ihas.controllers;

import com.example.ihas.devices.SmartCurtains;
import com.example.ihas.services.SmartCurtainsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/curtains")
public class SmartCurtainsController {

    private final SmartCurtainsService curtainsService;

    public SmartCurtainsController(SmartCurtainsService service) {
        curtainsService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCurtains(Authentication auth) {
        String userId = auth.getName();
        List<SmartCurtains> list = curtainsService.getAll(userId);
        List<Map<String, Object>> response = list.stream().map(curtain -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", curtain.getId());
            m.put("name", curtain.getName());
            m.put("position", curtain.getPosition());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCurtains(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartCurtains curtain = curtainsService.get(id, userId);
            Map<String, Object> result = new HashMap<>();
            result.put("id", curtain.getId());
            result.put("name", curtain.getName());
            result.put("position", curtain.getPosition());
            result.put("eventLog", curtain.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addCurtains(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            int position = body.containsKey("position") ? Integer.parseInt(body.get("position").toString()) : 0;
            SmartCurtains curtain = new SmartCurtains(id, name);
            curtain.setPosition(position);
            curtainsService.add(curtain, userId);
            return ResponseEntity.ok("SmartCurtains added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCurtains(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            curtainsService.delete(id, userId);
            return ResponseEntity.ok("SmartCurtains deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<String> toggleCurtains(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            curtainsService.toggleCurtains(id, userId);
            return ResponseEntity.ok("SmartCurtains toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling curtains: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/updatePosition")
    public ResponseEntity<String> updatePosition(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            if (body.containsKey("position")) {
                int pos = Integer.parseInt(body.get("position").toString());
                String userId = auth.getName();
                curtainsService.updatePosition(id, pos, userId);
                return ResponseEntity.ok("Position updated");
            } else {
                return ResponseEntity.badRequest().body("Position value is required");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
