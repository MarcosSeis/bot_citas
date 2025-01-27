const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { handlerAI } = require('../whisper');
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

const flowVoiceNotes = addKeyword(EVENTS.VOICE_NOTE).addAnswer(
  'Esta es nota de voz',
  null,
  async (ctx, ctxFn) => {
    const text = await handlerAI(ctx);
    const prompt = consultasPrompt;
    const consulta = text;
    const answer = await chat(prompt, consulta);
    await ctxFn.flowDynamic(answer.content);
  },
);

module.exports = { flowVoiceNotes };
