const {Collection, GatewayIntentBits, Client} = require('discord.js');
const fs = require('fs');
const ErrorHandler = require('./src/handlers/exceptions/ExceptionHandler')
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
});
client.commands = new Collection();

const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`src/commands/${file}`);
    client.commands.set(command.name, command);
}


fs.readdir('./src/events/', (err, files) => {
    if (err) return ErrorHandler.handle(err, "Error reading events directory");
    files.forEach(file => {
        const event = require(`./src/events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.login(process.env.DISCORD_TOKEN);