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

    public SmartRefrigerator getRefrigerator(String id, String user_id) {
        return dao.findById(id, user_id);
    }

    public List<SmartRefrigerator> getAllRefrigerators(String user_id) {
        return dao.findAllByUser(user_id);
    }

    public void addRefrigerator(SmartRefrigerator refrigerator, String user_id) {
        dao.save(refrigerator, user_id);
    }

    public void deleteRefrigerator(String id, String user_id) {
        dao.delete(id, user_id);
    }

    public void setTemperature(String id, double temp, String user_id) {
        SmartRefrigerator fr = dao.findById(id, user_id);
        fr.setTemperature(temp);
        dao.update(fr, user_id);
    }

    public void updateTemperature(String id, double temp, String user_id) {
        SmartRefrigerator ref = dao.findById(id, user_id);
        ref.setTemperature(temp);
        dao.update(ref, user_id);
    }

    public void toggleDoor(String id, String user_id) {
        SmartRefrigerator fr = dao.findById(id, user_id);
        fr.togglePower();
        dao.update(fr, user_id);
    }

    public void addItem(String id, String item, String expiry, String user_id) {
        SmartRefrigerator ref = dao.findById(id, user_id);
        ref.addItem(item, LocalDate.parse(expiry));
        dao.update(ref, user_id);
    }

    public void removeItem(String id, String item, String user_id) {
        SmartRefrigerator ref = dao.findById(id, user_id);
        ref.removeItem(item);
        dao.update(ref, user_id);
    }

    public String checkExpiredItems(String id, String user_id) {
        SmartRefrigerator ref = dao.findById(id, user_id);
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
