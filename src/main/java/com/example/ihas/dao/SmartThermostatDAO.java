package com.example.ihas.dao;

import com.example.ihas.devices.SmartThermostat;
import com.example.ihas.devices.SmartThermostat.Mode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class SmartThermostatDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(SmartThermostat thermostat, String userId) {
        String sql = """
            INSERT INTO smart_thermostat (id, name, is_on, temperature, mode, user_id)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                thermostat.getId(),
                thermostat.getName(),
                thermostat.isOn(),
                thermostat.getTemperature(),
                thermostat.getMode().name(),
                userId
        );
    }

    public SmartThermostat findById(String id, String userId) {
        String sql = """
            SELECT id, name, is_on, temperature, mode
            FROM smart_thermostat
            WHERE id = ? AND user_id = ?
        """;
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Mode mode = Mode.valueOf(rs.getString("mode"));
            SmartThermostat st = new SmartThermostat(
                    rs.getString("id"),
                    rs.getString("name")
            );
            if (rs.getBoolean("is_on") != st.isOn()) {
                st.togglePower();
            }
            st.setTemperature(rs.getDouble("temperature"));
            st.setMode(mode);
            return st;
        }, id, userId);
    }

    public List<SmartThermostat> findAllByUser(String userId) {
        String sql = """
            SELECT id, name, is_on, temperature, mode
            FROM smart_thermostat
            WHERE user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Mode mode = Mode.valueOf(rs.getString("mode"));
            SmartThermostat st = new SmartThermostat(
                    rs.getString("id"),
                    rs.getString("name")
            );
            if (rs.getBoolean("is_on") != st.isOn()) {
                st.togglePower();
            }
            st.setTemperature(rs.getDouble("temperature"));
            st.setMode(mode);
            return st;
        }, userId);
    }

    public void update(SmartThermostat thermostat, String userId) {
        String sql = """
            UPDATE smart_thermostat
            SET name = ?, is_on = ?, temperature = ?, mode = ?
            WHERE id = ? AND user_id = ?
        """;
        jdbcTemplate.update(sql,
                thermostat.getName(),
                thermostat.isOn(),
                thermostat.getTemperature(),
                thermostat.getMode().name(),
                thermostat.getId(),
                userId
        );
    }

    public void delete(String id, String userId) {
        String sql = "DELETE FROM smart_thermostat WHERE id = ? AND user_id = ?";
        jdbcTemplate.update(sql, id, userId);
    }
}
