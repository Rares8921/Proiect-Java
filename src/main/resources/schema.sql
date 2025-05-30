CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS smart_plug (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_on BOOLEAN NOT NULL,
    current_consumption DOUBLE NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_refrigerator (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    temperature DOUBLE NOT NULL,
    door_open BOOLEAN NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_refrigerator_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refrigerator_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    FOREIGN KEY (refrigerator_id) REFERENCES smart_refrigerator(id)
);

CREATE TABLE IF NOT EXISTS smart_sensor (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(20) NOT NULL,
    last_reading DOUBLE NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_sprinkler (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_on BOOLEAN NOT NULL,
    watering_duration INT NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_thermostat (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_on BOOLEAN NOT NULL,
    temperature DOUBLE NOT NULL,
    mode VARCHAR(10) NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_camera (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_recording BOOLEAN NOT NULL,
    resolution VARCHAR(20) NOT NULL,
    detection_sensitivity INT NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_car_charger (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_charging BOOLEAN NOT NULL,
    current DOUBLE NOT NULL,
    voltage DOUBLE NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_curtains (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position INT NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_door_lock (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    locked BOOLEAN NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_oven (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_on BOOLEAN NOT NULL,
    temperature DOUBLE NOT NULL,
    timer INT NOT NULL,
    preheat BOOLEAN NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_alarm_system (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_armed BOOLEAN NOT NULL,
    alarm_triggered BOOLEAN NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_lights (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    is_on BOOLEAN NOT NULL,
    brightness INT NOT NULL,
    color VARCHAR(20) NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_hub (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS smart_assistant (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hub_id VARCHAR(50),
    user_id VARCHAR(36),
    FOREIGN KEY (hub_id) REFERENCES smart_hub(id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);