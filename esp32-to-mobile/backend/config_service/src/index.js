const express = require('express');
const initializeDatabase = require('./config/database');
const queries = require('./config/queries');

const app = express();
db = initializeDatabase();

app.use(express.json());

const DEFAULT_THRESHOLD = 5;
const PORT = 8080;

// Registra um sensor no back-end. Também cria uma configuração padrão para ele (threshold = 5)

app.post('/sensor', (req, res) => {
    const { sensorId, sensorName } = req.body;

    if (!sensorId || !sensorName) {
        return res.status(400).send("ID e nome do sensor devem ser informados");
    }

    db.serialize(() => {
        db.run(queries.BEGIN_TRANSACTION, (beginError) => {
            if (beginError) {
                console.error('Erro ao iniciar cadastro do sensor:', beginError);
                return res.status(500).send('Erro ao cadastrar sensor');
            }

            const rollbackAndRespond = (error, message) => {
                console.error(message, error);
                db.run(queries.ROLLBACK_TRANSACTION, (rollbackError) => {
                    if (rollbackError) {
                        console.error('Erro ao desfazer cadastro do sensor:', rollbackError);
                    }
                    res.status(500).send(message);
                });
            };

            db.run(queries.INSERT_SENSOR, [sensorId, sensorName], (sensorError) => {
                if (sensorError) {
                    return rollbackAndRespond(sensorError, 'Erro ao cadastrar sensor');
                }

                db.run(queries.INSERT_SENSOR_CONFIG, [sensorId, DEFAULT_THRESHOLD], (configError) => {
                    if (configError) {
                        return rollbackAndRespond(
                            configError,
                            'Erro ao cadastrar configuração padrão do sensor'
                        );
                    }

                    db.run(queries.COMMIT_TRANSACTION, (commitError) => {
                        if (commitError) {
                            return rollbackAndRespond(commitError, 'Erro ao cadastrar sensor');
                        }
                        res.status(201).send('Sensor cadastrado com sucesso');
                    });
                });
            });
        });
    });
});

// Pega a configuração atual (limite do sensor) da tabela de configurações

app.get('/sensor/config/:sensorId', (req, res) => {
    const sensorId = req.params?.sensorId;

    if (!sensorId) {
        return res.status(400).send("ID do sensor deve ser informado");
    }

    db.get(queries.GET_SENSOR_CONFIG,
    sensorId, (err, result) => {
        if (err) { 
            res.status(500).send('Erro ao obter dados');
        } else if (!result) {
            res.status(404).send('Sensor não encontrado');
        } 
        else {
            res.status(200).json(result);
        }
    });
});

// Atualiza a configuração do sensor

app.put('/sensor/config/:sensorId', (req, res) => {
    const sensorId = req.params?.sensorId;

    if (!sensorId) {
        return res.status(400).send("ID do sensor deve ser informado");
    }

    db.run(queries.UPDATE_SENSOR_CONFIG,
           [req.body?.threshold, sensorId], function(err) {
            if (err){
                res.status(500).send('Erro ao alterar dados');
            } else if (this.changes == 0) {
                res.status(404).send('Sensor não encontrado');
            } else {
                res.status(200).send('Limite do sensor alterado com sucesso');
            }
    });
});

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