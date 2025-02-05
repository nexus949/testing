import { configDotenv } from 'dotenv';
configDotenv();

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { sendPrompt } from './aiPrompt.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

//bot ready event listener
client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ask') {

    await interaction.deferReply();

    const prompt = interaction.options._hoistedOptions[0].value;   //to understand this do -> console.log(interaction.options)
    const response = await sendPrompt(prompt);

    await interaction.editReply(response.botResponse[0]);

    for (let chunk = 1; chunk < response.botResponse.length; chunk++) {
      await interaction.followUp(response.botResponse[chunk]); //send the rest of the chunks
    }
  }
});

client.login(process.env.BOT_TOKEN);

