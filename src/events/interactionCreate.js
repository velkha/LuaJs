// events/interactionCreate.js
const { MessageFlags } = require('discord.js');
const ErrorHandler = require('../handlers/exceptions/ExceptionHandler');
const { isUserGlobalAllowed } = require('../utils/UserUtils');
const { handleMusicButton } = require('../buttons/musicButtons');

/**
 * Verifica los permisos del usuario
 * @param {Interaction} interaction - La interacción
 * @returns {Promise<boolean>} - true si tiene permisos, false si no
 */
async function checkUserPermissions(interaction) {
    if (!isUserGlobalAllowed(interaction.user.username)) {
        await interaction.reply({ 
            content: '❌ No tienes permiso para usar este bot.',
            flags: MessageFlags.Ephemeral
        });
        return false;
    }
    return true;
}

/**
 * Maneja los comandos slash
 * @param {Client} client - El cliente de Discord
 * @param {Interaction} interaction - La interacción
 */
async function handleSlashCommand(client, interaction) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        ErrorHandler.handle(error, interaction);
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ 
                content: 'Hubo un error al ejecutar este comando.', 
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({ 
                content: 'Hubo un error al ejecutar este comando.', 
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

/**
 * Maneja las interacciones de botones
 * @param {Interaction} interaction - La interacción
 */
async function handleButtonInteraction(interaction) {
    const buttonId = interaction.customId;

    try {
        // Delegar a los handlers específicos según el prefijo del botón
        if (buttonId.startsWith('music_')) {
            await handleMusicButton(interaction);
        }
        // Aquí se pueden añadir más categorías de botones:
        // else if (buttonId.startsWith('config_')) { ... }
        // else if (buttonId.startsWith('admin_')) { ... }
    } catch (error) {
        ErrorHandler.handle(error, interaction);
        
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ 
                content: '❌ Error al procesar el botón.', 
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

/**
 * Evento principal de interacciones
 */
module.exports = async (client, interaction) => {
    // Verificar permisos globales para todas las interacciones
    const hasPermission = await checkUserPermissions(interaction);
    if (!hasPermission) return;

    // Manejar comandos slash
    if (interaction.isChatInputCommand()) {
        await handleSlashCommand(client, interaction);
        return;
    }

    // Manejar botones
    if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
        return;
    }

    // Aquí se pueden añadir más tipos de interacciones:
    // - Select menus (interaction.isStringSelectMenu())
    // - Modals (interaction.isModalSubmit())
    // - Context menus (interaction.isContextMenuCommand())
};
