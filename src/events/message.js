// events/message.js
const ErrorHandler = require('../handlers/exceptions/ExceptionHandler');
// const initAI = require('../ai-calls/base'); // Temporalmente deshabilitado
const { isUserGlobalAllowed } = require('../utils/UserUtils');

module.exports = (client, message) => {
    const prefix = process.env.PREFIX;

    if (message.author.bot) return;
    
    // Verificar si el usuario tiene permiso global
    if (!isUserGlobalAllowed(message.author.username)) {
        // Para mensajes normales, enviamos un DM o respondemos normalmente
        // (ephemeral solo funciona con slash commands/interacciones)
        message.author.send('❌ No tienes permiso para usar este bot.')
            .catch(() => {
                // Si no puede enviar DM, responder en el canal
                message.reply('❌ No tienes permiso para usar este bot.');
            });
        return;
    }
    
    if (message.content.startsWith(process.env.PREFIX)) {
        executeCommand(message, client);
    }
    else {
        // OpenAI temporalmente deshabilitado
        message.reply('🤖 Las funciones de IA están temporalmente deshabilitadas.');
        
        /* 
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
        */
    }
};

/**
 * Execute the command that the user has requested
 */
const executeCommand = (message, client) => {
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