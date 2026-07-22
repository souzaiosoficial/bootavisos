require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

// Arquivo onde guardamos o ID da última mensagem enviada
// (assim, se o bot reiniciar, ele lembra qual mensagem apagar)
const STATE_FILE = path.join(__dirname, 'lastMessage.json');

function lerUltimaMensagem() {
  try {
    const data = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(data).lastMessageId || null;
  } catch {
    return null;
  }
}

function salvarUltimaMensagem(id) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ lastMessageId: id }));
  } catch (err) {
    console.error('⚠️ Não foi possível salvar o estado:', err);
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// ==== CONFIGURAÇÕES (vêm do .env) ====
const CHANNEL_ID = process.env.CHANNEL_ID;                 // canal onde a mensagem será postada
const SUPPORT_CHANNEL_ID = process.env.SUPPORT_CHANNEL_ID;  // canal de suporte/atendimento
const FEEDBACK_CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID;// canal de feedbacks
const INTERVAL_HOURS = Number(process.env.INTERVAL_HOURS || 3);

// ==== MONTA A MENSAGEM (edite o texto livremente aqui) ====
function montarMensagem() {
  return (
    `# VENDAS ON\n\n` +
    `↳ Nossos serviços estão 100% on-line e disponivel para todos.\n` +
    `↳ Tenha suporte em <#${SUPPORT_CHANNEL_ID}>\n` +
    `↳ Oque você procura esta aqui <#${FEEDBACK_CHANNEL_ID}>\n\n` +
    `Todas as entregas são realizadas instantaneamente, garantindo agilidade, praticidade e segurança.\n\n` +
    `@everyone`
  );
}

async function enviarMensagem() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // Apaga a mensagem anterior (se existir) antes de enviar a nova
    const lastId = lerUltimaMensagem();
    if (lastId) {
      try {
        const msgAntiga = await channel.messages.fetch(lastId);
        await msgAntiga.delete();
        console.log(`🗑️ Mensagem anterior (${lastId}) apagada.`);
      } catch {
        // Se já foi apagada manualmente ou não existe mais, apenas ignora
        console.log('ℹ️ Mensagem anterior não encontrada (talvez já tenha sido apagada).');
      }
    }

    const novaMensagem = await channel.send({
      content: montarMensagem(),
      allowedMentions: { parse: ['everyone'] }, // necessário para o @everyone realmente marcar
    });

    salvarUltimaMensagem(novaMensagem.id);
    console.log(`[${new Date().toLocaleString('pt-BR')}] ✅ Mensagem enviada em #${channel.name}`);
  } catch (err) {
    console.error('❌ Erro ao enviar mensagem:', err);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
  console.log(`⏰ Enviando a cada ${INTERVAL_HOURS} hora(s) no canal ${CHANNEL_ID}`);

  // Envia uma vez assim que o bot liga (remova esta linha se não quiser envio imediato)
  enviarMensagem();

  // Repete a cada X horas
  setInterval(enviarMensagem, INTERVAL_HOURS * 60 * 60 * 1000);
});

client.login(process.env.TOKEN);
