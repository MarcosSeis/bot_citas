const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');
require('dotenv').config();

const { flowConsultas } = require('./flows/flowConsultas');
const { flowMenuRest } = require('./flows/flowMenuRest');
const { flowReservar } = require('./flows/flowReservar');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { delay } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');

const menuPath = path.join(__dirname, 'mensajes', 'menu.txt');
const menu = fs.readFileSync(menuPath, 'utf8');

const flowWelcome = addKeyword(EVENTS.WELCOME).addAnswer(
  'Este es el flujo welcome',
  {
    delay: 100,
  },
  async (ctx, ctxFn) => {
    await ctxFn.flowDynamic('Hola es el flujo Dynamic');
  },
);

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
  .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
  .addAnswer('Como estas carnal');

const menuFlow = addKeyword('menu').addAnswer(
  menu,
  { capture: true },
  async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
    if (!['1', '2', '3', '0'].includes(ctx.body)) {
      return fallBack(
        'Respuesta no válida, por favor selecciona una de las opciones.',
      );
    }
    switch (ctx.body) {
      case '1':
        return gotoFlow(flowMenuRest);
      case '2':
        return gotoFlow(flowReservar);
      case '3':
        return gotoFlow(flowConsultas);
      case '0':
        return await flowDynamic(
          'Saliendo... Puedes volver a acceder a este menú escribiendo',
        );
    }
  },
);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowPrincipal,
    flowWelcome,
    menuFlow,
    flowMenuRest,
    flowConsultas,
    flowReservar,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
