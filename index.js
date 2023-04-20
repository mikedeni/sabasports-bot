const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv/config');
const WOK = require('wokcommands');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel],
});

client.on('ready', () => {
    console.log(`[Bot] login as ${client.user.tag}`);

    new WOK({
        client,
        commandsDir: path.join(__dirname, "commands"),
        testServers: '1095622871939817532'
    })
});

client.login(process.env.TOKEN);