// events/message.js
const ErrorHandler = require('../controllers/ErrorHandler');

module.exports = (client, message) => {
    const prefix = process.env.PREFIX;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        ErrorHandler.handle(error, message);
    }
};