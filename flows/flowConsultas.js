const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');

const flowConsultas = addKeyword([EVENTS.ACTION]).addAnswer(
  'Este es consultas',
);

module.exports = { flowConsultas };
