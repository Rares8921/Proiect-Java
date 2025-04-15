package com.example.ihas.services;

import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuditService {

    private static final String CSV_PATH = "audit.csv";

    public void logAction(String actionName) {
        // actiune,timestamp\n
        // try with resources ca dc nu
        try (FileWriter fw = new FileWriter(CSV_PATH, true)) {
            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            fw.write(actionName + "," + timestamp + "\n");
        } catch (IOException e) {
            System.err.println("Eroare la scrierea in " + CSV_PATH + " : " + e.getMessage());
        }
    }
}
