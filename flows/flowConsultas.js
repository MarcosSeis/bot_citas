const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const chat = require('../chatGPT');

const path = require('path');
const fs = require('fs');

const consultasPath = path.resolve(
  __dirname,
  '..',
  'mensajes',
  'promptConsultas.txt',
);
const consultasPrompt = fs.readFileSync(consultasPath, 'utf8');

const flowConsultas = addKeyword(EVENTS.ACTION)
  .addAnswer('Este es flow consultas')
  .addAnswer('hace tu consulta', { capture: true }, async (ctx, ctxFn) => {
    const prompt = consultasPrompt;
    const consulta = ctx.body;
    const answer = await chat(prompt, consulta);
    await ctxFn.flowDynamic(answer.content);
  });

module.exports = { flowConsultas };
