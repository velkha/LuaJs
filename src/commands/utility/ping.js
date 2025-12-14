const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({
			content: '👀 Este mensaje solo lo ves tú',
			flags: MessageFlags.Ephemeral
		});
	},
};

/**
 * ========================================================================================
 * DOCUMENTACIÓN DEL COMANDO /ping
 * ========================================================================================
 * 
 * DESCRIPCIÓN:
 * Comando simple de prueba que responde con un mensaje efímero.
 * Útil para verificar que el bot está activo y responde correctamente.
 * 
 * INTERACTÚA CON:
 * - discord.js (MessageFlags) → Para respuesta efímera
 * - No interactúa con otros módulos del bot
 * 
 * CARACTERÍSTICAS:
 * - Respuesta efímera (solo visible para quien ejecuta el comando)
 * - Sin lógica compleja ni validaciones adicionales
 * 
 * PROPÓSITO:
 * Comando básico de testing y verificación de conectividad del bot.
 * ========================================================================================
 */