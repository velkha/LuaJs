/**
 * Enum para estados de usuario en canales de voz
 */
const VoiceChannelStatus = Object.freeze({
    USER_IN_VALID_CHANNEL: 'USER_IN_VALID_CHANNEL',
    USER_IN_NON_ACCESSIBLE_CHANNEL: 'USER_IN_NON_ACCESSIBLE_CHANNEL',
    USER_NOT_IN_CHANNEL: 'USER_NOT_IN_CHANNEL',
    USER_CHANNEL_NOT_VOICE: 'USER_CHANNEL_NOT_VOICE',
    BOT_NO_PERMISSIONS: 'BOT_NO_PERMISSIONS'
});

module.exports = VoiceChannelStatus;
