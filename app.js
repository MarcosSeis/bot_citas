const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');

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
    if (!['1', '2', '3', '4', '5', '0'].includes(ctx.body)) {
      return fallBack(
        'Respuesta no válida, por favor selecciona una de las opciones.',
      );
    }
    switch (ctx.body) {
      case '1':
        return await flowDynamic('menu1');
      case '2':
        return await flowDynamic('menu2');
      case '3':
        return await flowDynamic('menu3');
      case '4':
        return await flowDynamic('menu4');
      case '5':
        return await flowDynamic('menu5');
      case '0':
        return await flowDynamic(
          'Saliendo... Puedes volver a acceder a este menú escribiendo',
        );
    }
  },
);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal, flowWelcome, menuFlow]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
