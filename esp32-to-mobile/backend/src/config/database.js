const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries');

function initializeDatabase() {
    const db = new sqlite3.Database('./dados.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível conectar ao SQLite.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });

    db.run(queries.CREATE_SENSOR_TABLE,
        [], (err) => {
        if (err) {
            console.log('ERRO: não foi possível criar a tabela de sensores');
            throw err;
        }
    });

    db.run(queries.CREATE_SENSOR_CONFIG_TABLE,
            [], (err) => {
            if (err) {
                console.log('ERRO: não foi possível criar a tabela de configuração do sensor.');
                throw err;
            }
        }); 

    db.run(queries.CREATE_SENSOR_HISTORY_TABLE,
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar a tabela de valores do sensor.');
              throw err;
           }
      });

    return db;
}

module.exports = initializeDatabase;