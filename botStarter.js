const {Collection, GatewayIntentBits, Client, Message} = require('discord.js');
const path = require('node:path');
const fs = require('fs');
const ErrorHandler = require('./src/handlers/exceptions/ExceptionHandler');
const MessageEvent = require('./src/events/message');

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

const foldersPath = path.join('./src/', 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require('./'+filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

/**
 * Generate collection of the events that the bot will work with
 */
const eventFiles = fs.readdir('./src/events/', (err, files) => {
    if (err) return ErrorHandler.handle(err, "Error reading events directory");
    files.forEach(file => {
        const event = require(`./src/events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.on('messageCreate', message => {
    MessageEvent(client, message);
});

client.login(process.env.DISCORD_TOKEN);