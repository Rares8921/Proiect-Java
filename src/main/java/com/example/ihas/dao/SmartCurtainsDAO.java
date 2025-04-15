package com.example.ihas.dao;

import com.example.ihas.devices.SmartCurtains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SmartCurtainsDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(SmartCurtains curtains, String userId) {
        String sql = """
            INSERT INTO smart_curtains (id, name, position, user_id)
            VALUES (?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                curtains.getId(),
                curtains.getName(),
                curtains.getPosition(),
                userId
        );
    }

    public SmartCurtains findById(String id, String userId) {
        String sql = """
            SELECT id, name, position
            FROM smart_curtains
            WHERE id = ? AND user_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
                new SmartCurtains(
                        rs.getString("id"),
                        rs.getString("name")
                ), id, userId);
    }

    public List<SmartCurtains> findAll(String userId) {
        String sql = """
            SELECT id, name, position
            FROM smart_curtains
            WHERE user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new SmartCurtains(
                        rs.getString("id"),
                        rs.getString("name")
                ), userId);
    }

    public void update(SmartCurtains curtains, String userId) {
        String sql = """
            UPDATE smart_curtains
            SET name = ?, position = ?
            WHERE id = ? AND user_id = ?
        """;
        jdbcTemplate.update(sql,
                curtains.getName(),
                curtains.getPosition(),
                curtains.getId(),
                userId
        );
    }

    public void delete(String id, String userId) {
        String sql = "DELETE FROM smart_curtains WHERE id = ? AND user_id = ?";
        jdbcTemplate.update(sql, id, userId);
    }
}
