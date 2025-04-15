package com.example.ihas.controllers;

import com.example.ihas.devices.SmartDoorLock;
import com.example.ihas.services.SmartDoorLockService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doorlocks")
public class SmartDoorLockController {

    private final SmartDoorLockService doorLockService;

    public SmartDoorLockController(SmartDoorLockService service) {
        doorLockService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDoorLocks(Authentication auth) {
        String userId = auth.getName();
        List<SmartDoorLock> list = doorLockService.getAll(userId);
        List<Map<String, Object>> response = list.stream().map(lock -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", lock.getId());
            m.put("name", lock.getName());
            m.put("locked", lock.isLocked());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDoorLock(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartDoorLock lock = doorLockService.get(id, userId);
            Map<String, Object> result = new HashMap<>();
            result.put("id", lock.getId());
            result.put("name", lock.getName());
            result.put("locked", lock.isLocked());
            result.put("eventLog", lock.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addDoorLock(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String userId = auth.getName();
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartDoorLock lock = new SmartDoorLock(id, name);
            doorLockService.add(lock, userId);
            return ResponseEntity.ok("SmartDoorLock added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoorLock(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            doorLockService.delete(id, userId);
            return ResponseEntity.ok("SmartDoorLock deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<String> toggleDoorLock(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            doorLockService.toggleDoorLock(id, userId);
            return ResponseEntity.ok("SmartDoorLock toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling SmartDoorLock: " + e.getMessage());
        }
    }
}
