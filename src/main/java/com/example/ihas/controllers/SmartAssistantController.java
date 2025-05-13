package com.example.ihas.controllers;

import com.example.ihas.devices.SmartAssistant;
import com.example.ihas.services.SmartAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assistant")
public class SmartAssistantController {

    private final SmartAssistantService assistantService;

    public SmartAssistantController(SmartAssistantService _service) {
        assistantService = _service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAssistants( String user_id) {
        List<SmartAssistant> list = assistantService.getAll(user_id);
        List<Map<String, Object>> response = list.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("name", a.getName());
            m.put("hubId", a.getHubId());
            m.put("eventLogSize", a.getEventLog().size());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAssistant(@PathVariable String id,  String user_id) {
        try {
            SmartAssistant assistant = assistantService.get(id, user_id);
            Map<String, Object> result = new HashMap<>();
            result.put("id", assistant.getId());
            result.put("name", assistant.getName());
            result.put("hubId", assistant.getHubId());
            result.put("eventLog", assistant.getEventLog());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<String> addAssistant(@RequestBody Map<String, Object> body,  String user_id) {
        try {
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            String hubId = body.get("hubId").toString();
            SmartAssistant assistant = new SmartAssistant(id, name, hubId);
            assistantService.add(assistant, user_id);
            return ResponseEntity.ok("SmartAssistant added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssistant(@PathVariable String id,  String user_id) {
        try {
            assistantService.delete(id, user_id);
            return ResponseEntity.ok("SmartAssistant deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<String> processCommand(@PathVariable String id, @RequestParam String command,  String user_id) {
        try {
            assistantService.processVoiceCommand(id, command, user_id);
            return ResponseEntity.ok("Command processed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing command: " + e.getMessage());
        }
    }
}
