package com.example.ihas.dao;

import com.example.ihas.devices.SmartAlarmSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SmartAlarmSystemDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(SmartAlarmSystem alarm, String userId) {
        String sql = """
            INSERT INTO smart_alarm_system (id, name, is_armed, alarm_triggered, user_id)
            VALUES (?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql, alarm.getId(), alarm.getName(), alarm.isArmed(), alarm.isAlarmTriggered(), userId);
    }

    public SmartAlarmSystem findById(String id, String userId) {
        String sql = """
            SELECT id, name, is_armed, alarm_triggered
            FROM smart_alarm_system
            WHERE id = ? AND user_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            SmartAlarmSystem alarm = new SmartAlarmSystem(
                    rs.getString("id"),
                    rs.getString("name")
            );
            if (rs.getBoolean("is_armed") != alarm.isArmed()) alarm.togglePower();
            if (rs.getBoolean("alarm_triggered") != alarm.isAlarmTriggered()) alarm.togglePower();
            return alarm;
        }, id, userId);
    }

    public List<SmartAlarmSystem> findAll(String userId) {
        String sql = """
            SELECT id, name, is_armed, alarm_triggered
            FROM smart_alarm_system
            WHERE user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SmartAlarmSystem alarm = new SmartAlarmSystem(
                    rs.getString("id"),
                    rs.getString("name")
            );
            if (rs.getBoolean("is_armed") != alarm.isArmed()) alarm.togglePower();
            if (rs.getBoolean("alarm_triggered") != alarm.isAlarmTriggered()) alarm.togglePower();
            return alarm;
        }, userId);
    }

    public void update(SmartAlarmSystem alarm, String userId) {
        String sql = """
            UPDATE smart_alarm_system
            SET name = ?, is_armed = ?, alarm_triggered = ?
            WHERE id = ? AND user_id = ?
        """;
        jdbcTemplate.update(sql, alarm.getName(), alarm.isArmed(), alarm.isAlarmTriggered(), alarm.getId(), userId);
    }

    public void delete(String id, String userId) {
        String sql = "DELETE FROM smart_alarm_system WHERE id = ? AND user_id = ?";
        jdbcTemplate.update(sql, id, userId);
    }
}
