const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');

const flowMenuRest = addKeyword([EVENTS.ACTION]).addAnswer('Este es el menu');

module.exports = { flowMenuRest };
