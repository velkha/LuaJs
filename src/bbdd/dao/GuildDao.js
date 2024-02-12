const Guild = require('../models/Guild'); // Sequelize model
const GuildConfig = require('../models/GuildConfig'); // Sequelize model
const GuildExtra = require('../models/GuildExtra'); // Sequelize model
const PremiumLevel = require('../models/PremiumLevels'); // Sequelize model
const GuildDto = require('../dto/GuildDto');

class GuildDao {

    /**
     * Get all guilds in simple format (without extras or configurations)
     * @returns {Promise<Guild[]>}
     */
    static async getGuildsSimple() {
        try {
            const guilds = await Guild.findAll();
            return guilds.map(guild => new GuildDto(guild, null, null, null));
        } catch (error) {
            console.error('Error getting simple guilds:', error);
            throw error;
        }
    }

    /**
     * Get a guild in simple format by its unique ID
     * @param {int} id Unique ID
     * @returns {Promise<GuildDto>}
     */
    static async getGuildSimple(id) {
        try {
            const guild = await Guild.findByPk(id);
            return guild ? new GuildDto(guild, null, null, null) : null;
        } catch (error) {
            console.error('Error getting simple guild:', error);
            throw error;
        }
    }

    /**
     * Get a guild in simple format by its Discord ID
     * @param {string} idDiscord Discord ID
     * @returns {Promise<GuildDto>}
     */
    static async getGuildSimple_discord(idDiscord) {
        try {
            const guild = await Guild.findOne({ where: { id: idDiscord } });
            return guild ? new GuildDto(guild, null, null, null) : null;
        } catch (error) {
            console.error('Error getting simple guild by Discord ID:', error);
            throw error;
        }
    }

    /**
     * Get a guild with its configuration by our unique ID
     * @param {int} id Unique ID
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWConfig(id) {
        try {
            const guild = await Guild.findByPk(id, {
                include: [{ model: GuildConfig, as: 'config' }]
            });
            return guild ? new GuildDto(guild, guild.config, null, null) : null;
        } catch (error) {
            console.error('Error getting guild with config:', error);
            throw error;
        }
    }

    /**
     * Get a guild with its configuration by its Discord ID
     * @param {string} idDiscord Discord ID
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWConfig_discord(idDiscord) {
        try {
            const guild = await Guild.findOne({
                where: { id: idDiscord },
                include:  [{ model: GuildConfig, as: 'config' }]
            });
            return guild ? new GuildDto(guild, guild.config, null, null) : null;
        } catch (error) {
            console.error('Error getting guild with config by Discord ID:', error);
            throw error;
        }
    }

    /**
     * Get a guild with its extras by our unique ID
     * @param {int} id Unique ID
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWExtras(id) {
        try {
            const guild = await Guild.findByPk(id, {
                include: GuildExtra
            });
            return guild ? new GuildDto(guild, null, guild.GuildExtra, null) : null;
        } catch (error) {
            console.error('Error getting guild with extras:', error);
            throw error;
        }
    }

    /**
     * Get a guild with its extras by its Discord ID
     * @param {string} idDiscord Discord ID
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWExtras_discord(idDiscord) {
        try {
            const guild = await Guild.findOne({
                where: { id: idDiscord },
                include: GuildExtra
            });
            return guild ? new GuildDto(guild, null, guild.GuildExtra, null) : null;
        } catch (error) {
            console.error('Error getting guild with extras by Discord ID:', error);
            throw error;
        }
    }

    /**
     * Get a full guild with its configuration and extras by our unique ID
     * @param {int} id Unique ID
     * @returns {Promise<GuildDto>}
     */
    static async getFullGuild(id) {
        try {
            const guild = await Guild.findByPk(id, {
                include: [
                    { model: GuildConfig, as: 'config', include: [{ model: PremiumLevel, as: 'premiumLevel' }] },
                    { model: GuildExtra, as: 'extra' },  
                ]
            });
    
            // Ensure to access the included models using the correct aliases
            return guild ? new GuildDto(guild, guild.config, guild.extra, guild.config.premiumLevel) : null;
        } catch (error) {
            console.error('Error getting full guild:', error);
            throw error;
        }
    }

    /**
     * Get a full guild with its configuration and extras by its Discord ID
     * @param {string} idDiscord Discord ID
     * @returns {Promise<GuildDto>}
     */
    static async getFullGuild_discord(idDiscord) {
        try {
            const guild = await Guild.findOne({
                where: { id: idDiscord },
                include: [
                    { model: GuildConfig, as: 'config', include: [{ model: PremiumLevel, as: 'premiumLevel' }] },
                    { model: GuildExtra, as: 'extra' },
                ]
            });
            return guild ? new GuildDto(guild, guild.config, guild.extra, guild.config.premiumLevel) : null;
        } catch (error) {
            console.error('Error getting full guild by Discord ID:', error);
            throw error;
        }
    }
}

module.exports = GuildDao;
