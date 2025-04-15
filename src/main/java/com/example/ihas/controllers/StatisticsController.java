package com.example.ihas.controllers;

import com.example.ihas.services.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService _statisticsService) {
        statisticsService = _statisticsService;
    }

    @GetMapping("/api/statistics")
    public ResponseEntity<?> getStatistics(Authentication auth) {
        return ResponseEntity.ok(statisticsService.getStatistics(auth.getName()));
    }
}
