const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = 3000;
const MQTT = 'mqtt://localhost:1883'

app.use(bodyParser.json());

// Пример маршрута для получения статуса микросервиса
app.get('/status', (req, res) => {
	res.json({
		status: 'MQTT broker is running'
	});
});

// Пример маршрута для отправки команды через HTTP
app.post('/send-command', (req, res) => {
	const {
		imei,
		topic,
		payload
	} = req.body;
	if (!imei || !topic || !payload) {
		return res.status(400).json({
			error: 'Missing required fields'
		});
	}

	// Публикация команды в MQTT
	const mqttClient = require('mqtt').connect(MQTT);
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/${topic}`, payload, (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				});
			}
			res.json({
				status: 'Command sent'
			});
		});
	});
});

// Маршрут для получения текущей конфигурации
app.post('/get-config', (req, res) => {
	const {
		imei
	} = req.body;
	if (!imei) {
		return res.status(400).json({
			error: 'Missing required fields'
		});
	}

	const mqttClient = require('mqtt').connect(MQTT);
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/commands/settings/get`, '', (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				});
			}
			res.json({
				status: 'Command sent'
			});
		});
	});
});

// Маршрут для установки времени
app.post('/set-time', (req, res) => {
	const {
		imei,
		time
	} = req.body;
	if (!imei || !time) {
		return res.status(400).json({
			error: 'Missing required fields'
		});
	}

	const mqttClient = require('mqtt').connect(MQTT);
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/commands/time/set`, time, (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				});
			}
			res.json({
				status: 'Command sent'
			});
		});
	});
});

// Маршрут для задания расписания включения КА в РУ часы
app.post('/set-schedule', (req, res) => {
	const {
		imei,
		schedule
	} = req.body

	if (!imei || !schedule) {
		return res.status(400).json({
			error: "Missing required fields"
		})
	}

	const mqttClient = require('mqtt').connect(MQTT);
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/commands/schedule/set`, schedule, (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command sent'
			})
		})
	})
})

// Маршрут для скачивания расписания включения КА в РУ часы 
app.post('download-schedule', (req, res) => {
	const {
		imei,
		path,
		size,
		crc
	} = req.body
	if (!imei || !path || !size || !crc) {
		return res.status(400).json({
			error: "Missing reqired fields"
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/commands/schedule/download`, payload, (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command sent'
			})
		})
	})
})

// Маршрут для удаления расписания включения КА в РУ часы
app.post('delete-schedule', (req, res) => {
	const {
		imei
	} = req.body

	if (!imei) {
		return res.status(400).json({
			error: "Messing reqired fields"
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqtt.publish(`controllers/${imei}/in/commands/schedule/delete`, '', (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command sent'
			})
		})
	})
})

// Маршррут для назначения РО КА
app.post('/switch-ka', (req, res) => {
	const {
		imei,
		kaNumber,
		state
	} = req.body

	if (!imei || !kaNumber || !state) {
		return res.status(400).json({
			error: 'Missing required fields'
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/outputs/${kaNumber}/switch`, state.toString(), err => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command set'
			})
		})
	})
})

// Маршрут для назначения РУ Ка
app.post('/set-ka-mode', (req, res) => {
	const {
		imei,
		kaNumber,
		mode
	} = req.body

	if (!imei || !kaNumber || !mode) {
		return res.status(400).json({
			error: 'Missing required fields'
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/outputs/${kaNumber}/mode`, mode.toString(), err => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command set'
			})
		})
	})
})

// Маршрут для установки/снятия блокировки смены РО для КА
app.post('/set-ka-lock', (req, res) => {
	const {
		imei,
		kaNumber,
		lockState
	} = req.body

	if (!imei || !kaNumber || !lockState) {
		return res.status(400).json({
			error: 'Missing required fields'
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/outputs/${kaNumber}/lock`, lockState.toString(), err => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command set'
			})
		})
	})
})

//Маршрут для установки/снятия флага автоматического перехода из РУ А В РУ Ч
app.post('/set-ka-flag', (req, res) => {
	const {
		imei,
		kaNumber,
		flagState
	} = req.body

	if (!imei || !kaNumber || !flagState) {
		return res.status(400).json({
			error: 'Missing required fields'
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/outputs/${kaNumber}/flag`, flagState.toString(), err => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command set'
			})
		})
	})
})

//Маршрут для получения РО для каждого РУ КА
app.post('/get-ka-ro', (req, res) => {
	const {
		imei
	} = req.body
	if (!imei) {
		return res.status(400).json({
			error: 'Missing require fields'
		})
	}

	const mqttClient = require('mqtt').connect(MQTT)
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/outputs/predict`, '', (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				})
			}
			res.json({
				status: 'Command sent'
			})
		})
	})
})

//Маршрут для получения текущих значений напряжений на входах
app.post('/get-input-voltages', (req, res) => {
	const {
		imei
	} = req.body;
	if (!imei) {
		return res.status(400).json({
			error: 'Missing required fields'
		});
	}

	const mqttClient = require('mqtt').connect('mqtt://localhost:1883');
	mqttClient.on('connect', () => {
		mqttClient.publish(`controllers/${imei}/in/inputs/get`, '', (err) => {
			if (err) {
				return res.status(500).json({
					error: 'Failed to publish command'
				});
			}
			res.json({
				status: 'Command sent'
			});
		});
	});
});

app.listen(HTTP_PORT, () => {
	console.log(`HTTP server started on port ${HTTP_PORT}`);
});