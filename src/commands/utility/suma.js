const { SlashCommandBuilder, MessageFlags } = require('discord.js');

/**
 * Realiza la suma de dos números
 * @param {number} num1 - Primer número
 * @param {number} num2 - Segundo número
 * @returns {number} - Resultado de la suma
 */
function sumarNumeros(num1, num2) {
	return num1 + num2;
}

/**
 * Valida que los parámetros sean números válidos
 * @param {number} num1 - Primer número
 * @param {number} num2 - Segundo número
 * @returns {Object} - { valid: boolean, error: string|null }
 */
function validarParametros(num1, num2) {
	if (isNaN(num1) || isNaN(num2)) {
		return {
			valid: false,
			error: '❌ Ambos parámetros deben ser números válidos.'
		};
	}

	if (!isFinite(num1) || !isFinite(num2)) {
		return {
			valid: false,
			error: '❌ Los números deben ser finitos (no infinitos).'
		};
	}

	return { valid: true, error: null };
}

/**
 * Formatea el resultado de la suma
 * @param {number} num1 - Primer número
 * @param {number} num2 - Segundo número
 * @param {number} resultado - Resultado de la suma
 * @returns {string} - Mensaje formateado
 */
function formatearResultado(num1, num2, resultado) {
	return `🧮 **Resultado de la suma:**\n\n` +
		   `\`\`\`\n` +
		   `${num1} + ${num2} = ${resultado}\n` +
		   `\`\`\``;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suma')
		.setDescription('Suma dos números')
		.addNumberOption(option =>
			option
				.setName('numero1')
				.setDescription('Primer número a sumar')
				.setRequired(true)
		)
		.addNumberOption(option =>
			option
				.setName('numero2')
				.setDescription('Segundo número a sumar')
				.setRequired(true)
		),

	async execute(interaction) {
		// Obtener los parámetros
		const num1 = interaction.options.getNumber('numero1');
		const num2 = interaction.options.getNumber('numero2');

		// Validar los parámetros
		const validacion = validarParametros(num1, num2);
		if (!validacion.valid) {
			await interaction.reply({
				content: validacion.error,
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Realizar la suma
		const resultado = sumarNumeros(num1, num2);

		// Formatear y enviar el resultado
		const mensaje = formatearResultado(num1, num2, resultado);
		await interaction.reply(mensaje);
	},

	// Exportar las funciones para testing o reutilización
	sumarNumeros,
	validarParametros,
	formatearResultado
};

/**
 * ========================================================================================
 * DOCUMENTACIÓN DEL COMANDO /suma
 * ========================================================================================
 * 
 * DESCRIPCIÓN:
 * Comando ejemplo que suma dos números y muestra el resultado.
 * Demuestra modularización de lógica en funciones separadas.
 * 
 * INTERACTÚA CON:
 * - discord.js (SlashCommandBuilder, MessageFlags) → Construcción del comando
 * - No interactúa con otros módulos del bot
 * 
 * FUNCIONES MODULARES:
 * - sumarNumeros()         → Realiza la operación matemática
 * - validarParametros()    → Valida que sean números válidos y finitos
 * - formatearResultado()   → Formatea la respuesta con formato código
 * 
 * VALIDACIONES:
 * - ✅ Parámetros deben ser números válidos (no NaN)
 * - ✅ Parámetros deben ser finitos (no Infinity)
 * 
 * EJEMPLO DE USO:
 * /suma numero1:5 numero2:3  → "5 + 3 = 8"
 * 
 * PROPÓSITO:
 * Ejemplo de comando bien modularizado con funciones reutilizables y testables.
 * ========================================================================================
 */
