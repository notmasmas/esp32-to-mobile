const express = require('express');
const initializeDatabase = require('./config/database');
const queries = require('./config/queries');

const app = express();
db = initializeDatabase();

app.use(express.json());

const PORT = 8081;

// Pega o histórico de valores lidos pelo sensor

app.get('/sensor/history/:sensorId', (req, res) => {

    const sensorId = req.params?.sensorId;

    if (sensorId == undefined) {
        return res.status(400).send('ID do sensor deve ser informado');
    }

    db.all(queries.GET_SENSOR_HISTORY,
        sensorId, (err, result) => {
        if (err) { 
            res.status(500).send('Erro ao obter dados');
        } else if (result.length == 0) {
            res.status(404).send('Sensor não encontrado ou não possui nenhum registro');
        } else {
            res.status(200).json(result);
        }
    });
});

// Registra um novo valor lido pelo sensor no histórico

app.post('/sensor/history/:sensorId', (req, res) => {

    const sensorId = req.params.sensorId;

    if (sensorId == undefined) {
        return res.status(400).send('ID do sensor deve ser informado');
    }

    if (req.body?.reportedValue == undefined) {
        return res.status(400).send('Valor reportado não foi informado');
    }

    db.run(queries.INSERT_SENSOR_HISTORY,
         [sensorId, req.body.reportedValue], (err) => {
        if (err) {
            res.status(500).send(`Erro ao registrar valor no sensor ${sensorId}`);
        } else {
            res.status(201).send('Valor registrado com sucesso');
        }
    });
});

app.listen(PORT, () => {
    console.log('Backend inicializado');
});