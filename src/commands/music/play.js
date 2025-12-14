const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { getUserVoiceChannelStatus, VoiceChannelStatus } = require('../../utils/UserUtils');
const StringUtils = require('../../utils/StringUtils');
const MusicPlayer = require('../../utils/MusicPlayer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce audio de YouTube con controles interactivos')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('URL de YouTube a reproducir')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const url = interaction.options.getString('url');

        // Validar que sea una URL de YouTube
        if (!StringUtils.isYouTubeURL(url)) {
            return await interaction.reply({
                content: '❌ La URL debe ser de YouTube (youtube.com o youtu.be).',
                flags: MessageFlags.Ephemeral
            });
        }

        // Verificar estado del canal de voz del usuario
        const { status, channel } = getUserVoiceChannelStatus(interaction);

        if (status !== VoiceChannelStatus.USER_IN_VALID_CHANNEL) {
            const messages = {
                [VoiceChannelStatus.USER_NOT_IN_CHANNEL]: '❌ Debes estar en un canal de voz para usar este comando.',
                [VoiceChannelStatus.USER_CHANNEL_NOT_VOICE]: '❌ No estás en un canal de voz válido.',
                [VoiceChannelStatus.BOT_NO_PERMISSIONS]: '❌ No tengo permisos para unirme a tu canal de voz.',
                [VoiceChannelStatus.USER_IN_NON_ACCESSIBLE_CHANNEL]: '❌ No puedo acceder a tu canal de voz.',
            };

            return await interaction.reply({
                content: messages[status] || '❌ Error desconocido.',
                flags: MessageFlags.Ephemeral
            });
        }

        // Responder inmediatamente (defer) mientras se carga el video
        await interaction.deferReply();

        try {
            // Obtener instancia del reproductor para este servidor
            const player = MusicPlayer.getInstance(interaction.guildId);

            // Iniciar reproducción
            const result = await player.play(channel, url);

            if (!result.success) {
                return await interaction.editReply({
                    content: `❌ ${result.message}`
                });
            }

            // Crear los botones de control
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music_pause')
                        .setLabel('⏸️ Pausar')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true), // Deshabilitado hasta implementar pause
                    new ButtonBuilder()
                        .setCustomId('music_stop')
                        .setLabel('⏹️ Detener')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('music_skip')
                        .setLabel('⏭️ Siguiente')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true) // Deshabilitado hasta implementar cola
                );

            // Responder con el mensaje y los botones
            await interaction.editReply({
                content: `🎵 **Reproduciendo:** ${result.title}\n📍 **Canal:** ${channel.name}\n\n_Usa los botones para controlar la reproducción_`,
                components: [row]
            });

        } catch (error) {
            console.error('Error en comando play:', error);
            await interaction.editReply({
                content: '❌ Hubo un error al intentar reproducir el audio.'
            });
        }
    },
};

/**
 * ========================================================================================
 * DOCUMENTACIÓN DEL COMANDO /play
 * ========================================================================================
 * 
 * DESCRIPCIÓN:
 * Comando que permite reproducir audio de YouTube en un canal de voz.
 * Muestra botones interactivos para controlar la reproducción (pausar, detener, siguiente).
 * 
 * FLUJO DE EJECUCIÓN:
 * 1. Usuario ejecuta /play <url_youtube>
 * 2. Validación de URL → StringUtils.isYouTubeURL()
 * 3. Verificación de canal de voz → UserUtils.getUserVoiceChannelStatus()
 * 4. Creación de botones interactivos → discord.js (ActionRowBuilder, ButtonBuilder)
 * 5. Respuesta con botones al usuario
 * 6. Usuario presiona botón → interactionCreate.js detecta la interacción
 * 7. Delegación a buttons/musicButtons.js según el customId del botón
 * 
 * INTERACTÚA CON:
 * - StringUtils.isYouTubeURL()              → Valida que la URL sea de YouTube
 * - UserUtils.getUserVoiceChannelStatus()  → Verifica estado del canal de voz
 * - UserUtils.VoiceChannelStatus           → Enum con estados posibles del canal
 * - buttons/musicButtons.js                → Maneja los eventos de los botones
 * - events/interactionCreate.js            → Punto de entrada de interacciones
 * 
 * BOTONES CREADOS:
 * - music_pause  → Pausar/Reanudar reproducción (ButtonStyle.Primary)
 * - music_stop   → Detener y salir del canal (ButtonStyle.Danger)
 * - music_skip   → Saltar a siguiente canción (ButtonStyle.Secondary)
 * 
 * VALIDACIONES:
 * - ✅ Usuario debe tener permisos globales (interactionCreate.js)
 * - ✅ URL debe ser de YouTube (youtube.com o youtu.be)
 * - ✅ Usuario debe estar en un canal de voz
 * - ✅ Canal debe ser accesible por el bot
 * - ✅ Bot debe tener permisos de Connect y Speak
 * 
 * PRÓXIMAS IMPLEMENTACIONES:
 * - [ ] Lógica de reproducción real usando play-dl o ytdl-core
 * - [ ] Sistema de cola de canciones
 * - [ ] Persistencia de estado de reproducción por servidor
 * - [ ] Extracción de metadata del video (título, duración, thumbnail)
 * ========================================================================================
 */
