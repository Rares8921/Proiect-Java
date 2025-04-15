package com.example.ihas.services;

import com.example.ihas.dao.SmartRefrigeratorDAO;
import com.example.ihas.devices.SmartRefrigerator;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class SmartRefrigeratorService {

    private final SmartRefrigeratorDAO dao;

    public SmartRefrigeratorService(SmartRefrigeratorDAO _dao) {
        dao = _dao;
    }

    public SmartRefrigerator getRefrigerator(String id, String userId) {
        return dao.findById(id, userId);
    }

    public List<SmartRefrigerator> getAllRefrigerators(String userId) {
        return dao.findAllByUser(userId);
    }

    public void addRefrigerator(SmartRefrigerator refrigerator, String userId) {
        dao.save(refrigerator, userId);
    }

    public void deleteRefrigerator(String id, String userId) {
        dao.delete(id, userId);
    }

    public void setTemperature(String id, double temp, String userId) {
        SmartRefrigerator fr = dao.findById(id, userId);
        fr.setTemperature(temp);
        dao.update(fr, userId);
    }

    public void updateTemperature(String id, double temp, String userId) {
        SmartRefrigerator ref = dao.findById(id, userId);
        ref.setTemperature(temp);
        dao.update(ref, userId);
    }

    public void toggleDoor(String id, String userId) {
        SmartRefrigerator fr = dao.findById(id, userId);
        fr.togglePower();
        dao.update(fr, userId);
    }

    public void addItem(String id, String item, String expiry, String userId) {
        SmartRefrigerator ref = dao.findById(id, userId);
        ref.addItem(item, LocalDate.parse(expiry));
        dao.update(ref, userId);
    }

    public void removeItem(String id, String item, String userId) {
        SmartRefrigerator ref = dao.findById(id, userId);
        ref.removeItem(item);
        dao.update(ref, userId);
    }

    public String checkExpiredItems(String id, String userId) {
        SmartRefrigerator ref = dao.findById(id, userId);
        List<String> expired = ref.getInventory().entrySet().stream()
                .filter(entry -> entry.getKey().isBefore(LocalDate.now()))
                .flatMap(entry -> entry.getValue().stream())
                .toList();

        if (expired.isEmpty()) {
            return "No expired items.";
        } else {
            return "Expired items: " + String.join(", ", expired);
        }
    }

}
