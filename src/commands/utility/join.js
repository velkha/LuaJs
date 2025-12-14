const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { getUserVoiceChannelStatus, VoiceChannelStatus } = require('../../utils/UserUtils');
const StringUtils = require('../../utils/StringUtils');

/**
 * Une el bot al canal de voz por un tiempo determinado
 * @param {VoiceChannel} channel - El canal de voz al que unirse
 * @param {number} duration - Duración en milisegundos
 * @returns {Promise<void>}
 */
async function joinVoiceChannelForDuration(channel, duration = 10000) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    return new Promise((resolve, reject) => {
        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log(`✅ Bot conectado al canal de voz: ${channel.name}`);
            
            // Desconectar después del tiempo especificado
            setTimeout(() => {
                connection.destroy();
                console.log(`👋 Bot desconectado del canal de voz: ${channel.name}`);
                resolve();
            }, duration);
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            connection.destroy();
            resolve();
        });

        connection.on('error', (error) => {
            console.error('Error en la conexión de voz:', error);
            connection.destroy();
            reject(error);
        });
    });
}

/**
 * Maneja los diferentes estados del canal de voz del usuario
 * @param {Interaction} interaction - La interacción de Discord
 * @param {string} status - El estado del canal de voz
 * @returns {Promise<void>}
 */
async function handleVoiceChannelStatus(interaction, status) {
    const messages = {
        [VoiceChannelStatus.USER_NOT_IN_CHANNEL]: '❌ No estás en un canal de voz. Únete a uno primero.',
        [VoiceChannelStatus.USER_CHANNEL_NOT_VOICE]: '❌ No estás en un canal de voz válido.',
        [VoiceChannelStatus.BOT_NO_PERMISSIONS]: '❌ No tengo permisos para unirme a tu canal de voz.',
        [VoiceChannelStatus.USER_IN_NON_ACCESSIBLE_CHANNEL]: '❌ No puedo acceder a tu canal de voz.',
    };

    await interaction.reply({
        content: messages[status] || '❌ Error desconocido.',
        flags: MessageFlags.Ephemeral
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('El bot se une a tu canal de voz durante 10 segundos')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('URL a validar (opcional)')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const url = interaction.options.getString('url');

        // Validar URL
        if (!StringUtils.isValidURL(url)) {
            return await interaction.reply({
                content: '❌ La URL proporcionada no es válida.',
                flags: MessageFlags.Ephemeral
            });
        }

        // Verificar estado del canal de voz del usuario
        const { status, channel } = getUserVoiceChannelStatus(interaction);

        if (status !== VoiceChannelStatus.USER_IN_VALID_CHANNEL) {
            return await handleVoiceChannelStatus(interaction, status);
        }

        // Responder al usuario que el bot se está uniendo
        await interaction.reply({
            content: `✅ URL válida. Uniéndome al canal de voz **${channel.name}** por 10 segundos...`,
            flags: MessageFlags.Ephemeral
        });

        try {
            // Unirse al canal de voz
            await joinVoiceChannelForDuration(channel, 10000);

            // Notificar que se completó
            await interaction.followUp({
                content: '✅ He salido del canal de voz.',
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error('Error al unirse al canal de voz:', error);
            
            await interaction.followUp({
                content: '❌ Hubo un error al intentar unirme al canal de voz.',
                flags: MessageFlags.Ephemeral
            });
        }
    },
};

/**
 * ========================================================================================
 * DOCUMENTACIÓN DEL COMANDO /join
 * ========================================================================================
 * 
 * DESCRIPCIÓN:
 * Comando de prueba que une el bot a un canal de voz durante 10 segundos.
 * Requiere una URL válida como parámetro (no la utiliza, solo la valida).
 * 
 * INTERACTÚA CON:
 * - StringUtils.isValidURL()               → Valida formato de URL
 * - UserUtils.getUserVoiceChannelStatus()  → Verifica estado del canal de voz
 * - @discordjs/voice.joinVoiceChannel()    → Une el bot al canal de voz
 * - @discordjs/voice.VoiceConnectionStatus → Estados de la conexión de voz
 * 
 * FUNCIONES INTERNAS:
 * - joinVoiceChannelForDuration()  → Une el bot por tiempo determinado
 * - handleVoiceChannelStatus()     → Maneja errores de validación de canal
 * 
 * VALIDACIONES:
 * - ✅ Usuario debe tener permisos globales
 * - ✅ URL debe ser válida (http/https)
 * - ✅ Usuario debe estar en un canal de voz válido
 * - ✅ Bot debe tener permisos necesarios
 * 
 * USO:
 * Comando de prueba para verificar conectividad de voz antes de implementar
 * la reproducción de audio real.
 * ========================================================================================
 */
