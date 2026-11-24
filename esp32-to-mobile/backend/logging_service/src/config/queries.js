const CREATE_SENSOR_HISTORY_TABLE = `CREATE TABLE IF NOT EXISTS sensor_history
    (id INTEGER PRIMARY KEY, sensor_id INTEGER NOT NULL, reported_value INTEGER NOT NULL, reported_at DATETIME)`;

const GET_SENSOR_HISTORY = 'SELECT * FROM sensor_history WHERE sensor_id = ?';

const INSERT_SENSOR_HISTORY = `INSERT INTO sensor_history(sensor_id, reported_value, reported_at)
    VALUES(?, ?, DATETIME('now'))`;

module.exports = {
    CREATE_SENSOR_HISTORY_TABLE,
    GET_SENSOR_HISTORY,
    INSERT_SENSOR_HISTORY
};
