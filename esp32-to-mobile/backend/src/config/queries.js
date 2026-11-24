const CREATE_SENSOR_TABLE = `CREATE TABLE IF NOT EXISTS sensor
    (sensor_id INTEGER PRIMARY KEY, sensor_name VARCHAR(40) NOT NULL)`;

const CREATE_SENSOR_CONFIG_TABLE = `CREATE TABLE IF NOT EXISTS sensor_config
    (sensor_id INTEGER PRIMARY KEY, threshold INTEGER NOT NULL, updated_at DATETIME,
    FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id))`;

const CREATE_SENSOR_HISTORY_TABLE = `CREATE TABLE IF NOT EXISTS sensor_history
    (id INTEGER PRIMARY KEY, sensor_id INTEGER NOT NULL, reported_value INTEGER NOT NULL, reported_at DATETIME,
    FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id))`;

const INSERT_SENSOR = 'INSERT INTO sensor(sensor_id, sensor_name) VALUES(?, ?)';

const INSERT_SENSOR_CONFIG = `INSERT INTO sensor_config(sensor_id, threshold, updated_at)
    VALUES(?, ?, DATETIME('now'))`;

const GET_SENSOR_CONFIG = 'SELECT * FROM sensor_config WHERE sensor_id = ?';

const UPDATE_SENSOR_CONFIG = `UPDATE sensor_config
    SET threshold = COALESCE(?, threshold), updated_at = DATETIME('now')
    WHERE sensor_id = ?`;

const GET_SENSOR_HISTORY = 'SELECT * FROM sensor_history WHERE sensor_id = ?';

const INSERT_SENSOR_HISTORY = `INSERT INTO sensor_history(sensor_id, reported_value, reported_at)
    VALUES(?, ?, DATETIME('now'))`;

module.exports = {
    CREATE_SENSOR_TABLE,
    CREATE_SENSOR_CONFIG_TABLE,
    CREATE_SENSOR_HISTORY_TABLE,
    INSERT_SENSOR,
    INSERT_SENSOR_CONFIG,
    GET_SENSOR_CONFIG,
    UPDATE_SENSOR_CONFIG,
    GET_SENSOR_HISTORY,
    INSERT_SENSOR_HISTORY,
};
