const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies with Hello!'),
	async execute(interaction) {
		await interaction.reply('Hello!');
	},
};

/**
 * ========================================================================================
 * DOCUMENTACIÓN DEL COMANDO /hello
 * ========================================================================================
 * 
 * DESCRIPCIÓN:
 * Comando simple de prueba que responde con "Hello!".
 * 
 * INTERACTÚA CON:
 * - discord.js (SlashCommandBuilder) → Construcción del comando
 * - No interactúa con otros módulos del bot
 * 
 * CARACTERÍSTICAS:
 * - Respuesta pública (visible para todos en el canal)
 * - Sin parámetros ni validaciones
 * 
 * PROPÓSITO:
 * Comando de ejemplo básico para testing.
 * ========================================================================================
 */