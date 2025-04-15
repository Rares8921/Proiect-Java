package com.example.ihas.controllers;

import com.example.ihas.devices.SmartAlarmSystem;
import com.example.ihas.services.SmartAlarmSystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alarm")
public class SmartAlarmSystemController {

    private final SmartAlarmSystemService alarmService;

    public SmartAlarmSystemController(SmartAlarmSystemService service) {
        alarmService = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAlarmSystems(Authentication auth) {
        String userId = auth.getName();
        List<SmartAlarmSystem> list = alarmService.getAll(userId);
        List<Map<String, Object>> response = list.stream().map(this::mapping).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapping(SmartAlarmSystem alarm) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", alarm.getId());
        m.put("name", alarm.getName());
        m.put("isArmed", alarm.isArmed());
        m.put("alarmTriggered", alarm.isAlarmTriggered());
        return m;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAlarmSystem(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            SmartAlarmSystem alarm = alarmService.get(id, userId);
            Map<String, Object> result = mapping(alarm);
            result.put("eventLog", alarm.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addAlarmSystem(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            String userId = auth.getName();
            SmartAlarmSystem alarm = new SmartAlarmSystem(id, name);
            alarmService.add(alarm, userId);
            return ResponseEntity.ok("Alarm system added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlarmSystem(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            alarmService.delete(id, userId);
            return ResponseEntity.ok("Alarm system deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/arm")
    public ResponseEntity<String> armAlarm(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            alarmService.armAlarmSystem(id, userId);
            return ResponseEntity.ok("Alarm armed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error arming alarm: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/disarm")
    public ResponseEntity<String> disarmAlarm(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            alarmService.disarmAlarmSystem(id, userId);
            return ResponseEntity.ok("Alarm disarmed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error disarming alarm: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/trigger")
    public ResponseEntity<String> triggerAlarm(@PathVariable String id, Authentication auth) {
        try {
            String userId = auth.getName();
            alarmService.triggerAlarm(id, userId);
            return ResponseEntity.ok("Alarm triggered");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error triggering alarm: " + e.getMessage());
        }
    }
}
