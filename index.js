const { Client, IntentsBitField, Partials } = require("discord.js");
const path = require("path");
const WOK = require("wokcommands");
require("dotenv/config");

const client = new Client({
  intents: 3276799,
  partials: [Partials.Channel],
});

client.on("ready", () => {
  console.log(`[BOT], Login as ${client.user.tag}`);
  
  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
  });
});

client.login(process.env.TOKEN);