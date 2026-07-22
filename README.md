# Bot de Vendas Automático (Discord)

Este bot envia uma mensagem formatada marcando `@everyone` a cada X horas (padrão: 3h) em um canal específico do seu servidor.

## 1. Criar o bot no Discord

1. Acesse https://discord.com/developers/applications
2. Clique em **New Application**, dê um nome
3. Vá em **Bot** (menu lateral) > **Add Bot**
4. Em **Privileged Gateway Intents**, não precisa ativar nenhuma (o bot só envia mensagem, não lê)
5. Clique em **Reset Token** e copie o token — ele vai no `.env` como `TOKEN`

## 2. Convidar o bot para o servidor

1. Vá em **OAuth2 > URL Generator**
2. Marque o escopo `bot`
3. Em permissões marque: `Send Messages`, `Mention Everyone`, `Read Message History`, `Manage Messages`
4. Copie o link gerado, abra no navegador e adicione o bot ao seu servidor

⚠️ Importante: o **cargo do bot** precisa ter a permissão "Mencionar @everyone" habilitada nas configurações do cargo (Configurações do Servidor > Cargos), ou o `@everyone` não vai marcar de verdade — só vai aparecer como texto.

## 3. Pegar os IDs dos canais

1. No Discord, vá em **Configurações > Avançado** e ative o **Modo Desenvolvedor**
2. Clique com o botão direito no canal de vendas, no canal de suporte e no de feedbacks
3. Clique em **Copiar ID do Canal** para cada um

## 4. Configurar o `.env`

Renomeie `.env.example` para `.env` e preencha:

```
TOKEN=seu_token_aqui
CHANNEL_ID=id_do_canal_de_vendas
SUPPORT_CHANNEL_ID=id_do_canal_de_atendimento
FEEDBACK_CHANNEL_ID=id_do_canal_de_feedbacks
INTERVAL_HOURS=3
```

No Pella, normalmente você configura essas variáveis na aba de **Environment Variables** do painel, não precisa subir o arquivo `.env` dentro do zip.

## 5. Editar o texto da mensagem (opcional)

Abra `index.js` e edite a função `montarMensagem()` — pode mudar frases, adicionar emojis, trocar o título, etc.

## 6. Subir no Pella

1. Compacte a pasta inteira em um `.zip` (incluindo `index.js`, `package.json` — **não** precisa incluir `node_modules` nem `.env`)
2. No painel do Pella, escolha **Code Source > File Upload**, envie o `.zip`
3. Escolha o tipo **NodeJS**
4. Configure as variáveis de ambiente (`TOKEN`, `CHANNEL_ID`, etc.) no painel
5. Defina o comando de start como `node index.js` (ou `npm start`)

## 7. Testar

Ao ligar, o bot já envia a mensagem uma vez (para você conferir se está tudo certo) e depois repete a cada `INTERVAL_HOURS` horas automaticamente, mesmo que o processo continue rodando sem reiniciar.

## 8. Exclusão automática da mensagem anterior

Antes de enviar uma nova mensagem, o bot apaga a anterior automaticamente. O ID da última mensagem enviada fica salvo no arquivo `lastMessage.json` (criado sozinho na primeira execução), então isso funciona mesmo se o bot reiniciar.

⚠️ Para o bot conseguir apagar mensagens, ele também precisa da permissão **Manage Messages** (Gerenciar Mensagens) no canal, além das permissões já mencionadas no passo 2.
