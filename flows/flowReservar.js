const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');

const flowReservar = addKeyword([EVENTS.ACTION]).addAnswer(
  'Estas son las reservas',
);

module.exports = { flowReservar };
