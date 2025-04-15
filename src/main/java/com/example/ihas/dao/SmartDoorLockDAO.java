package com.example.ihas.dao;

import com.example.ihas.devices.SmartDoorLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SmartDoorLockDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(SmartDoorLock lock, String userId) {
        String sql = """
            INSERT INTO smart_door_lock (id, name, locked, user_id)
            VALUES (?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                lock.getId(),
                lock.getName(),
                lock.isLocked(),
                userId
        );
    }

    public SmartDoorLock findById(String id, String userId) {
        String sql = """
            SELECT id, name, locked
            FROM smart_door_lock
            WHERE id = ? AND user_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            SmartDoorLock lock = new SmartDoorLock(
                    rs.getString("id"),
                    rs.getString("name")
            );
            if (rs.getBoolean("locked") != lock.isLocked()) lock.togglePower();
            return lock;
        }, id, userId);
    }

    public List<SmartDoorLock> findAll(String userId) {
        String sql = """
            SELECT id, name, locked
            FROM smart_door_lock
            WHERE user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SmartDoorLock lock = new SmartDoorLock(
                    rs.getString("id"),
                    rs.getString("name")
            );
            if (rs.getBoolean("locked") != lock.isLocked()) lock.togglePower();
            return lock;
        }, userId);
    }

    public void update(SmartDoorLock lock, String userId) {
        String sql = """
            UPDATE smart_door_lock
            SET name = ?, locked = ?
            WHERE id = ? AND user_id = ?
        """;
        jdbcTemplate.update(sql,
                lock.getName(),
                lock.isLocked(),
                lock.getId(),
                userId
        );
    }

    public void delete(String id, String userId) {
        String sql = "DELETE FROM smart_door_lock WHERE id = ? AND user_id = ?";
        jdbcTemplate.update(sql, id, userId);
    }
}
