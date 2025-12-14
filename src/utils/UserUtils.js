const { PermissionFlagsBits } = require('discord.js');
const VoiceChannelStatus = require('./enums/VoiceChannelStatus');

/**
 * Lista de usuarios globalmente permitidos para usar el bot
 */
const ALLOWED_USERS = Object.freeze({
    VELKHA: 'velkha_',
    ZELTI: '_zelti_',
    BRONX: 'bronx2202'
});

/**
 * Verifica si un usuario tiene permiso global para usar el bot
 * @param {string} username - El nombre de usuario de Discord
 * @returns {boolean} - true si el usuario está permitido, false en caso contrario
 */
const isUserGlobalAllowed = (username) => {
    if (!username) return false;
    
    const normalizedUsername = username.toLowerCase().trim();
    const allowedValues = Object.values(ALLOWED_USERS).map(u => u.toLowerCase());
    
    return allowedValues.includes(normalizedUsername);
};

/**
 * Verifica el estado del usuario en canales de voz y si el bot puede acceder
 * @param {Interaction} interaction - La interacción de Discord
 * @returns {Object} - { status: VoiceChannelStatus, channel: VoiceChannel|null }
 */
const getUserVoiceChannelStatus = (interaction) => {
    const member = interaction.member;
    
    // Verificar si el usuario está en un canal de voz
    if (!member.voice.channel) {
        return {
            status: VoiceChannelStatus.USER_NOT_IN_CHANNEL,
            channel: null
        };
    }

    const voiceChannel = member.voice.channel;

    // Verificar si es realmente un canal de voz (no stage channel u otro tipo)
    if (!voiceChannel.isVoiceBased()) {
        return {
            status: VoiceChannelStatus.USER_CHANNEL_NOT_VOICE,
            channel: null
        };
    }

    // Verificar permisos del bot en el canal
    const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
    
    if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
        return {
            status: VoiceChannelStatus.BOT_NO_PERMISSIONS,
            channel: voiceChannel
        };
    }

    // Verificar si el bot puede acceder al canal (no privado o con restricciones)
    if (!permissions.has(PermissionFlagsBits.ViewChannel)) {
        return {
            status: VoiceChannelStatus.USER_IN_NON_ACCESSIBLE_CHANNEL,
            channel: voiceChannel
        };
    }

    // Todo está bien
    return {
        status: VoiceChannelStatus.USER_IN_VALID_CHANNEL,
        channel: voiceChannel
    };
};

module.exports = {
    ALLOWED_USERS,
    isUserGlobalAllowed,
    getUserVoiceChannelStatus,
    VoiceChannelStatus
};
