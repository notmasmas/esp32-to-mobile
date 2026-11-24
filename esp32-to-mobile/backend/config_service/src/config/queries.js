const CREATE_SENSOR_TABLE = `CREATE TABLE IF NOT EXISTS sensor
    (sensor_id INTEGER PRIMARY KEY, sensor_name VARCHAR(40) NOT NULL)`;

const CREATE_SENSOR_CONFIG_TABLE = `CREATE TABLE IF NOT EXISTS sensor_config
    (sensor_id INTEGER PRIMARY KEY, threshold INTEGER NOT NULL, updated_at DATETIME,
    FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id))`;

const INSERT_SENSOR = 'INSERT INTO sensor(sensor_id, sensor_name) VALUES(?, ?)';

const INSERT_SENSOR_CONFIG = `INSERT INTO sensor_config(sensor_id, threshold, updated_at)
    VALUES(?, ?, DATETIME('now'))`;

const GET_SENSOR_CONFIG = 'SELECT * FROM sensor_config WHERE sensor_id = ?';

const UPDATE_SENSOR_CONFIG = `UPDATE sensor_config
    SET threshold = COALESCE(?, threshold), updated_at = DATETIME('now')
    WHERE sensor_id = ?`;

const BEGIN_TRANSACTION = 'BEGIN TRANSACTION';
const COMMIT_TRANSACTION = 'COMMIT TRANSACTION';
const ROLLBACK_TRANSACTION = 'ROLLBACK TRANSACTION';

module.exports = {
    CREATE_SENSOR_TABLE,
    CREATE_SENSOR_CONFIG_TABLE,
    INSERT_SENSOR,
    INSERT_SENSOR_CONFIG,
    GET_SENSOR_CONFIG,
    UPDATE_SENSOR_CONFIG,
    BEGIN_TRANSACTION,
    COMMIT_TRANSACTION,
    ROLLBACK_TRANSACTION,
};
