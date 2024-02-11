// events/message.js
const ErrorHandler = require('../handlers/exceptions/ExceptionHandler');
const initAI = require('../ai-calls/base');

module.exports = (client, message) => {
    const prefix = process.env.PREFIX;

    if (message.author.bot) return;
    if (message.content.startsWith(process.env.PREFIX)) {
        executeCommand(message);
    }
    else {
        try{
            initAI('session1', message).then(response => {
                message.channel.send(response);
            });
        }
        catch (error) {
            ErrorHandler.handle(error, message);
        }
        finally {
            console.log('AI call completed');
        }
    }
};

/**
 * Execute the command that the user has requested
 */
const executeCommand = (message) => {
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
}