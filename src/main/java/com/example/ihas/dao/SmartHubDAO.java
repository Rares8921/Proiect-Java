package com.example.ihas.dao;

import com.example.ihas.devices.SmartHub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SmartHubDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(SmartHub hub, String userId) {
        String sql = """
            INSERT INTO smart_hub (id, name, user_id)
            VALUES (?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                hub.getId(),
                hub.getName(),
                userId
        );
    }

    public SmartHub findById(String id, String userId) {
        String sql = """
            SELECT id, name
            FROM smart_hub
            WHERE id = ? AND user_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new SmartHub(
                        rs.getString("id"),
                        rs.getString("name")
                ), id, userId);
    }

    public List<SmartHub> findAll(String userId) {
        String sql = """
            SELECT id, name
            FROM smart_hub
            WHERE user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new SmartHub(
                        rs.getString("id"),
                        rs.getString("name")
                ), userId);
    }

    public void update(SmartHub hub, String userId) {
        String sql = """
            UPDATE smart_hub
            SET name = ?
            WHERE id = ? AND user_id = ?
        """;
        jdbcTemplate.update(sql,
                hub.getName(),
                hub.getId(),
                userId
        );
    }

    public void delete(String id, String userId) {
        String sql = "DELETE FROM smart_hub WHERE id = ? AND user_id = ?";
        jdbcTemplate.update(sql, id, userId);
    }
}
