package com.example.ihas.controllers;

import com.example.ihas.devices.SmartThermostat;
import com.example.ihas.services.SmartThermostatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/thermostats")
public class ThermostatController {

    private final SmartThermostatService thermostatService;

    public ThermostatController(SmartThermostatService service) {
        thermostatService = service;
    }

    @GetMapping
    public ResponseEntity<?> getAllThermostats(Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to access thermostats");
        }

        String user_id = auth.getName();
        List<SmartThermostat> list = thermostatService.getAllThermostats(user_id);
        List<Map<String, Object>> response = list.stream().map(this::mapping).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapping(SmartThermostat st) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", st.getId());
        m.put("name", st.getName());
        m.put("isOn", st.isOn());
        m.put("temperature", st.getTemperature());
        m.put("mode", st.getMode().name());
        m.put("eventLog", st.getEventLog());
        return m;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getThermostat(@PathVariable String id, Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to access thermostat");
        }

        try {
            SmartThermostat st = thermostatService.getThermostat(id, auth.getName());
            return ResponseEntity.ok(mapping(st));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addThermostat(@RequestBody Map<String, Object> body, Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to add thermostat");
        }

        try {
            String id = body.get("id").toString();
            String name = body.get("name").toString();
            SmartThermostat st = new SmartThermostat(id, name);
            if (body.containsKey("temperature")) {
                double t = Double.parseDouble(body.get("temperature").toString());
                st.setTemperature(t);
            }
            if (body.containsKey("mode")) {
                SmartThermostat.Mode mode = SmartThermostat.Mode.valueOf(body.get("mode").toString());
                st.setMode(mode);
            }
            thermostatService.addThermostat(st, auth.getName());
            return ResponseEntity.ok("Thermostat added");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteThermostat(@PathVariable String id, Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to delete thermostat");
        }

        try {
            thermostatService.deleteThermostat(id, auth.getName());
            return ResponseEntity.ok("Thermostat deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<?> updateThermostat(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to update thermostat");
        }

        try {
            String user_id = auth.getName();
            if (body.containsKey("temperature")) {
                double t = Double.parseDouble(body.get("temperature").toString());
                thermostatService.updateTemperature(id, t, user_id);
            }
            if (body.containsKey("mode")) {
                SmartThermostat.Mode m = SmartThermostat.Mode.valueOf(body.get("mode").toString());
                thermostatService.updateMode(id, m, user_id);
            }
            return ResponseEntity.ok("Thermostat updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<?> togglePower(@PathVariable String id, Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to toggle thermostat power");
        }

        try {
            thermostatService.togglePower(id, auth.getName());
            return ResponseEntity.ok("Power toggled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error toggling power: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/autoAdjust")
    public ResponseEntity<?> autoAdjust(@PathVariable String id, @RequestBody Map<String, Object> body, Authentication auth) {
        // Check if authentication is null
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required to auto-adjust thermostat");
        }

        try {
            double ambient = Double.parseDouble(body.get("ambientTemp").toString());
            thermostatService.autoAdjust(id, ambient, auth.getName());
            return ResponseEntity.ok("Auto adjusted temperature");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error auto adjusting: " + e.getMessage());
        }
    }
}
