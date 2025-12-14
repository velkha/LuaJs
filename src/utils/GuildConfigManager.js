/**
 * Gestor de configuración de guilds para comandos
 * A futuro: cargará desde base de datos
 */
class GuildConfigManager {
    constructor() {
        this.guilds = [];
        this.loadGuilds();
    }

    /**
     * Carga el listado de guilds con sus configuraciones
     * TODO: A futuro extraer desde BBDD
     */
    loadGuilds() {
        // Por ahora carga solo el GUILD_ID del .env
        const guildId = process.env.GUILD_ID;
        
        if (guildId && guildId !== 'TU_SERVER_ID_AQUI') {
            this.guilds.push({
                id: guildId,
                name: 'Server Principal', // A futuro desde BBDD
                commands: 'all', // 'all' o array de nombres de comandos específicos
                enabled: true
            });
        }

        // TODO: En el futuro, cargar desde BBDD:
        // const guildsFromDB = await GuildDao.getAllActiveGuilds();
        // guildsFromDB.forEach(guild => {
        //     this.guilds.push({
        //         id: guild.id,
        //         name: guild.name,
        //         commands: guild.config.allowedCommands, // Array de comandos permitidos
        //         enabled: guild.config.commandsEnabled
        //     });
        // });
    }

    /**
     * Obtiene todos los IDs de guilds activos
     * @returns {string[]} Array de IDs de guilds
     */
    getActiveGuildIds() {
        return this.guilds
            .filter(guild => guild.enabled)
            .map(guild => guild.id);
    }

    /**
     * Obtiene los comandos permitidos para una guild específica
     * @param {string} guildId - ID de la guild
     * @param {Array} allCommands - Todos los comandos disponibles
     * @returns {Array} Array de comandos permitidos para esta guild
     */
    getCommandsForGuild(guildId, allCommands) {
        const guild = this.guilds.find(g => g.id === guildId);
        
        if (!guild || !guild.enabled) {
            return [];
        }

        // Si commands es 'all', retornar todos los comandos
        if (guild.commands === 'all') {
            return allCommands;
        }

        // Si es un array, filtrar solo los comandos permitidos
        if (Array.isArray(guild.commands)) {
            return allCommands.filter(cmd => 
                guild.commands.includes(cmd.name)
            );
        }

        return [];
    }

    /**
     * Verifica si el entorno es de producción
     * @returns {boolean}
     */
    isProduction() {
        const env = (process.env.entorno || process.env.NODE_ENV || 'dev').toLowerCase();
        return env === 'production' || env === 'prod';
    }

    /**
     * Verifica si el entorno es de desarrollo
     * @returns {boolean}
     */
    isDevelopment() {
        return !this.isProduction();
    }
}

module.exports = GuildConfigManager;
