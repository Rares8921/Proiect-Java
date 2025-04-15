package com.example.ihas.dao;

import com.example.ihas.devices.SmartCamera;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SmartCameraDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(SmartCamera camera, String userId) {
        String sql = """
            INSERT INTO smart_camera (id, name, is_recording, resolution, detection_sensitivity, user_id)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                camera.getId(), camera.getName(),
                camera.isRecording(),
                camera.getResolution(),
                camera.getDetectionSensitivity(),
                userId
        );
    }

    public SmartCamera findById(String id, String userId) {
        String sql = """
            SELECT id, name, is_recording, resolution, detection_sensitivity
            FROM smart_camera
            WHERE id = ? AND user_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            SmartCamera c = new SmartCamera(
                    rs.getString("id"),
                    rs.getString("name"),
                    rs.getString("resolution")
            );
            if (rs.getBoolean("is_recording") != c.isRecording()) c.togglePower();
            c.setResolution(rs.getString("resolution"));
            c.setDetectionSensitivity(rs.getInt("detection_sensitivity"));
            return c;
        }, id, userId);
    }

    public List<SmartCamera> findAll(String userId) {
        String sql = """
            SELECT id, name, is_recording, resolution, detection_sensitivity
            FROM smart_camera
            WHERE user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SmartCamera c = new SmartCamera(
                    rs.getString("id"),
                    rs.getString("name"),
                    rs.getString("resolution")
            );
            if (rs.getBoolean("is_recording") != c.isRecording()) c.togglePower();
            c.setResolution(rs.getString("resolution"));
            c.setDetectionSensitivity(rs.getInt("detection_sensitivity"));
            return c;
        }, userId);
    }

    public void update(SmartCamera camera, String userId) {
        String sql = """
            UPDATE smart_camera
            SET name = ?, is_recording = ?, resolution = ?, detection_sensitivity = ?
            WHERE id = ? AND user_id = ?
        """;
        jdbcTemplate.update(sql,
                camera.getName(),
                camera.isRecording(),
                camera.getResolution(),
                camera.getDetectionSensitivity(),
                camera.getId(),
                userId
        );
    }

    public void delete(String id, String userId) {
        String sql = "DELETE FROM smart_camera WHERE id = ? AND user_id = ?";
        jdbcTemplate.update(sql, id, userId);
    }
}
