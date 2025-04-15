package com.example.ihas.controllers;

import com.example.ihas.devices.SmartRefrigerator;
import com.example.ihas.services.SmartRefrigeratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/refrigerators")
public class SmartRefrigeratorController {

    private final SmartRefrigeratorService refrigeratorService;

    public SmartRefrigeratorController(SmartRefrigeratorService service) {
        refrigeratorService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRefrigerators(Authentication auth) {
        String userId = auth.getName();
        List<SmartRefrigerator> list = refrigeratorService.getAllRefrigerators(userId);
        List<Map<String, Object>> response = list.stream().map(ref -> {
            Map<String, Object> m = mapping(ref);
            m.put("inventorySize", ref.getInventory().size());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapping(SmartRefrigerator ref) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", ref.getId());
        m.put("name", ref.getName());
        m.put("temperature", ref.getTemperature());
        m.put("doorOpen", ref.isDoorOpen());
        return m;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRefrigerator(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartRefrigerator ref = refrigeratorService.getRefrigerator(id, userId);
            Map<String, Object> result = mapping(ref);
            result.put("inventory", ref.getInventory());
            result.put("eventLog", ref.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addRefrigerator(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartRefrigerator ref = new SmartRefrigerator(id, name);
            if (body.containsKey("temperature")) {
                double t = Double.parseDouble(body.get("temperature").toString());
                ref.setTemperature(t);
            }
            refrigeratorService.addRefrigerator(ref, userId);
            return ResponseEntity.ok("Refrigerator added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRefrigerator(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            refrigeratorService.deleteRefrigerator(id, userId);
            return ResponseEntity.ok("Refrigerator deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/updateTemperature")
    public ResponseEntity<String> updateTemperature(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            if (body.containsKey("temperature")) {
                double t = Double.parseDouble(body.get("temperature").toString());
                String userId = auth.getName();
                refrigeratorService.updateTemperature(id, t, userId);
                return ResponseEntity.ok("Temperature updated");
            } else {
                return ResponseEntity.badRequest().body("Temperature value is required");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggleDoor")
    public ResponseEntity<String> toggleDoor(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            refrigeratorService.toggleDoor(id, userId);
            return ResponseEntity.ok("Door toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling door: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/addItem")
    public ResponseEntity<String> addItem(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String item = body.get("item").toString();
            String expiry = body.get("expiry").toString();
            String userId = auth.getName();
            refrigeratorService.addItem(id, item, expiry, userId);
            return ResponseEntity.ok("Item added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding item: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/removeItem")
    public ResponseEntity<String> removeItem(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String item = body.get("item").toString();
            String userId = auth.getName();
            refrigeratorService.removeItem(id, item, userId);
            return ResponseEntity.ok("Item removed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removing item: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/checkExpired")
    public ResponseEntity<String> checkExpired(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            String result = refrigeratorService.checkExpiredItems(id, userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking expired items: " + e.getMessage());
        }
    }
}
