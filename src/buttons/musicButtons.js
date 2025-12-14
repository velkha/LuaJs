/**
 * Maneja las interacciones de los botones de control de música
 */
const MusicPlayer = require('../utils/MusicPlayer');

/**
 * Procesa la interacción de un botón de música
 * @param {Interaction} interaction - La interacción del botón
 * @returns {Promise<void>}
 */
async function handleMusicButton(interaction) {
    const buttonId = interaction.customId;

    // Mapeo de acciones por ID de botón
    const buttonActions = {
        'music_pause': handlePauseButton,
        'music_stop': handleStopButton,
        'music_skip': handleSkipButton
    };

    const handler = buttonActions[buttonId];

    if (!handler) {
        await interaction.reply({
            content: '❓ Botón desconocido',
            flags: 64 // MessageFlags.Ephemeral
        });
        return;
    }

    await handler(interaction);
}

/**
 * Maneja el botón de pausar/reanudar
 * @param {Interaction} interaction - La interacción del botón
 */
async function handlePauseButton(interaction) {
    // TODO: Implementar lógica de pausa/resume
    await interaction.reply({
        content: `⏸️ Botón **Pausar** presionado por ${interaction.user.username}\n\n_Función en desarrollo..._`
    });
}

/**
 * Maneja el botón de detener
 * @param {Interaction} interaction - La interacción del botón
 */
async function handleStopButton(interaction) {
    try {
        // Obtener instancia del reproductor del servidor
        const player = MusicPlayer.getInstance(interaction.guildId);

        // Verificar si hay algo reproduciéndose
        const status = player.getStatus();
        console.log("stop status:", status);
        if (!status.isConnected) {
            return await interaction.reply({
                content: '❌ No hay nada reproduciéndose actualmente.',
                flags: 64 // MessageFlags.Ephemeral
            });
        }

        // Detener reproducción
        const stopped = player.stop();

        if (stopped) {
            await interaction.reply({
                content: `⏹️ **Reproducción detenida** por ${interaction.user.username}\n\n_El bot ha salido del canal de voz._`
            });

            // Eliminar la instancia del servidor
            MusicPlayer.removeInstance(interaction.guildId);
        } else {
            await interaction.reply({
                content: '❌ Hubo un error al detener la reproducción.',
                flags: 64 // MessageFlags.Ephemeral
            });
        }

    } catch (error) {
        console.error('Error al detener reproducción:', error);
        await interaction.reply({
            content: '❌ Error al procesar la solicitud.',
            flags: 64 // MessageFlags.Ephemeral
        });
    }
}

/**
 * Maneja el botón de siguiente canción
 * @param {Interaction} interaction - La interacción del botón
 */
async function handleSkipButton(interaction) {
    // TODO: Implementar lógica de skip (requiere cola de reproducción)
    await interaction.reply({
        content: `⏭️ Botón **Siguiente** presionado por ${interaction.user.username}\n\n_Función en desarrollo... (requiere sistema de cola)_`
    });
}

module.exports = {
    handleMusicButton
};
