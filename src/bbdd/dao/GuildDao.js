const Database = require('../Database');
const GuildDto = require('../dto/GuildDto');
const Guild = require('../../models/Guild');
const GuildConfig = require('../../models/GuildConfig');
const GuildExtra = require('../../models/GuildExtra');
const PremiumLevel = require('../../models/PremiumLevel');

class GuildDao {

    /**
     * Devuelve todas las guilds en su formato simple (sin extras ni configuraciones)
     * @returns {Promise<Guild[]>}
     */
    static async getGuildsSimple() {
        const db = new Database();
        try {
            const results = await db.query('SELECT UniqueID AS g_UniqueID, id AS g_id, name AS g_name, description AS g_description FROM Guild');
            return results.map(row => new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description));
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    /**
     * Devuelve una guild en su formato simple (sin extras ni configuraciones)
     * @param {int} id identificador unico nuestro
     * @returns {Promise<Guild>}
     */
    static async getGuildSimple(id) {
        const db = new Database();
        try {
            const results = await db.query('SELECT UniqueID AS g_UniqueID, id AS g_id, name AS g_name, description AS g_description FROM Guild WHERE UniqueID = ?', [id]);
            if (results.length > 0) {
                const row = results[0];
                return new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }
    
    /**
     * Devuelve una guild en su formato simple (sin extras ni configuraciones)
     * @param {string} idDiscord identificador de discord
     * @returns {Promise<Guild>}
     */
    static async getGuildSimple_discord(idDiscord) {
        const db = new Database();
        try {
            const results = await db.query('SELECT UniqueID AS g_UniqueID, id AS g_id, name AS g_name, description AS g_description FROM Guild WHERE g_id = ?', [idDiscord]);
            if (results.length > 0) {
                const row = results[0];
                return new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    /**
     * Devuelve una guild con su configuracion por su id unico nuestro
     * @param {*} id 
     * @returns {Promise<GuildDto>} 
     */
    static async getGuildWConfig(id) {
        const db = new Database();
        try {
            const results = await db.query(`
                SELECT 
                    g.UniqueID AS g_UniqueID, g.id AS g_id, g.name AS g_name, g.description AS g_description,
                    gc.UniqueID AS gc_UniqueID, gc.nsfwEnable AS gc_nsfwEnable, gc.premiumLevelId AS gc_premiumLevelId
                FROM Guild g
                LEFT JOIN GuildConfig gc ON g.UniqueID = gc.UniqueID
                WHERE g.UniqueID = ?
            `, [id]);
            if (results.length > 0) {
                const row = results[0];
                const guild = new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
                const guildConfig = new GuildConfig(row.gc_UniqueID, row.gc_nsfwEnable, row.gc_premiumLevelId);
                return new GuildDto(guild, guildConfig, null, null);
            }
            return null;
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }
    /**
     * Devuelve una guild con su configuracion por su id de discord
     * @param {String} idDiscord 
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWConfig_discord(idDiscord) {
        const db = new Database();
        try {
            const results = await db.query(`
                SELECT 
                    g.UniqueID AS g_UniqueID, g.id AS g_id, g.name AS g_name, g.description AS g_description,
                    gc.UniqueID AS gc_UniqueID, gc.nsfwEnable AS gc_nsfwEnable, gc.premiumLevelId AS gc_premiumLevelId
                FROM Guild g
                LEFT JOIN GuildConfig gc ON g.UniqueID = gc.UniqueID
                WHERE g.id = ?
            `, [idDiscord]);
            if (results.length > 0) {
                const row = results[0];
                const guild = new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
                const guildConfig = new GuildConfig(row.gc_UniqueID, row.gc_nsfwEnable, row.gc_premiumLevelId);
                return new GuildDto(guild, guildConfig, null, null);
            }
            return null;
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    /**
     * Devuelve una guild con sus extras por su id unico nuestro
     * @param {int} id 
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWExtras(id) {
        const db = new Database();
        try {
            const results = await db.query(`
                SELECT 
                    g.UniqueID AS g_UniqueID, g.id AS g_id, g.name AS g_name, g.description AS g_description,
                    ge.UniqueID AS ge_UniqueID, ge.guildId AS ge_guildId, ge.ownerId AS ge_ownerId, ge.verified AS ge_verified, ge.partnered AS ge_partnered, 
                    ge.memberCount AS ge_memberCount, ge.maximumMembers AS ge_maximumMembers, ge.afkTimeout AS ge_afkTimeout, ge.createdAt AS ge_createdAt
                FROM Guild g
                LEFT JOIN GuildExtra ge ON g.UniqueID = ge.guildId
                WHERE g.UniqueID = ?
            `, [id]);
            if (results.length > 0) {
                const row = results[0];
                const guild = new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
                const guildExtra = new GuildExtra(row.ge_UniqueID, row.ge_guildId, row.ge_ownerId, row.ge_verified, row.ge_partnered, row.ge_memberCount, row.ge_maximumMembers, row.ge_afkTimeout, row.ge_createdAt);
                return new GuildDto(guild, null, guildExtra, null);
            }
            return null;
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    /**
     * Devuelve una guild con sus extras por su id de discord
     * @param {string} idDiscord 
     * @returns {Promise<GuildDto>}
     */
    static async getGuildWExtras_discord(idDiscord) {
        const db = new Database();
        try {
            const results = await db.query(`
                SELECT 
                    g.UniqueID AS g_UniqueID, g.id AS g_id, g.name AS g_name, g.description AS g_description,
                    ge.UniqueID AS ge_UniqueID, ge.guildId AS ge_guildId, ge.ownerId AS ge_ownerId, ge.verified AS ge_verified, ge.partnered AS ge_partnered, 
                    ge.memberCount AS ge_memberCount, ge.maximumMembers AS ge_maximumMembers, ge.afkTimeout AS ge_afkTimeout, ge.createdAt AS ge_createdAt
                FROM Guild g
                LEFT JOIN GuildExtra ge ON g.UniqueID = ge.guildId
                WHERE g.id = ?
            `, [idDiscord]);
            if (results.length > 0) {
                const row = results[0];
                const guild = new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
                const guildExtra = new GuildExtra(row.ge_UniqueID, row.ge_guildId, row.ge_ownerId, row.ge_verified, row.ge_partnered, row.ge_memberCount, row.ge_maximumMembers, row.ge_afkTimeout, row.ge_createdAt);
                return new GuildDto(guild, null, guildExtra, null);
            }
            return null;
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }

    /**
     * Devuelve una guild con su configuracion y extras por su id unico nuestro
     * @param {int} id 
     * @returns {Promise<GuildDto>}
     */
    static async getFullGuild(id) {
        const db = new Database();
        try {
            const query = `
            SELECT 
                g.UniqueID AS g_UniqueID,
                g.id AS g_id,
                g.name AS g_name,
                g.description AS g_description,
                ge.UniqueID AS ge_UniqueID,
                ge.guildId AS ge_guildId,
                ge.ownerId AS ge_ownerId,
                ge.verified AS ge_verified,
                ge.partnered AS ge_partnered,
                ge.memberCount AS ge_memberCount,
                ge.maximumMembers AS ge_maximumMembers,
                ge.afkTimeout AS ge_afkTimeout,
                ge.createdAt AS ge_createdAt,
                pl.UniqueID AS pl_UniqueID,
                pl.levelName AS pl_levelName,
                pl.gptLevel AS pl_gptLevel,
                pl.nsfwLevel AS pl_nsfwLevel,
                pl.infiniteGpt AS pl_infiniteGpt,
                pl.gptTokens AS pl_gptTokens,
                pl.nsfwTokens AS pl_nsfwTokens,
                gc.UniqueID AS gc_UniqueID,
                gc.nsfwEnable AS gc_nsfwEnable,
                gc.premiumLevelId AS gc_premiumLevelId
            FROM Guild g
            LEFT JOIN GuildConfig gc ON g.UniqueID = gc.UniqueID
            LEFT JOIN GuildExtra ge ON g.UniqueID = ge.guildId
            LEFT JOIN PremiumLevels pl ON gc.premiumLevelId = pl.UniqueID
            WHERE g.UniqueID = ?;
            `;
            const results = await db.query(query, [id]);
            if (results.length > 0) {
                const row = results[0];
                const guildData = new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
                const guildConfigData = new GuildConfig(row.gc_UniqueID, row.gc_nsfwEnable, row.gc_premiumLevelId);
                const guildExtraData = new GuildExtra(row.ge_UniqueID, row.ge_guildId, row.ge_ownerId, row.ge_verified, row.ge_partnered, row.ge_memberCount, row.ge_maximumMembers, row.ge_afkTimeout, row.ge_createdAt);
                const premiumLevelData = new PremiumLevel(row.pl_UniqueID, row.pl_levelName, row.pl_gptLevel, row.pl_nsfwLevel, row.pl_infiniteGpt, row.pl_gptTokens, row.pl_nsfwTokens);
                const guildDto = new GuildDto(guildData, guildConfigData, guildExtraData, premiumLevelData);
                return guildDto;
            }
            return null;
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }
    
    /**
     * Devuelve una guild con su configuracion y extras por su id de discord
     * @param {string} idDiscord 
     * @returns {Promise<GuildDto>}
     */
    static async getFullGuild_discord(idDiscord) {
        const db = new Database();
        try {
            const query = `
            SELECT 
                g.UniqueID AS g_UniqueID,
                g.id AS g_id,
                g.name AS g_name,
                g.description AS g_description,
                ge.UniqueID AS ge_UniqueID,
                ge.guildId AS ge_guildId,
                ge.ownerId AS ge_ownerId,
                ge.verified AS ge_verified,
                ge.partnered AS ge_partnered,
                ge.memberCount AS ge_memberCount,
                ge.maximumMembers AS ge_maximumMembers,
                ge.afkTimeout AS ge_afkTimeout,
                ge.createdAt AS ge_createdAt,
                pl.UniqueID AS pl_UniqueID,
                pl.levelName AS pl_levelName,
                pl.gptLevel AS pl_gptLevel,
                pl.nsfwLevel AS pl_nsfwLevel,
                pl.infiniteGpt AS pl_infiniteGpt,
                pl.gptTokens AS pl_gptTokens,
                pl.nsfwTokens AS pl_nsfwTokens,
                gc.UniqueID AS gc_UniqueID,
                gc.nsfwEnable AS gc_nsfwEnable,
                gc.premiumLevelId AS gc_premiumLevelId
            FROM Guild g
            LEFT JOIN GuildConfig gc ON g.UniqueID = gc.UniqueID
            LEFT JOIN GuildExtra ge ON g.UniqueID = ge.guildId
            LEFT JOIN PremiumLevels pl ON gc.premiumLevelId = pl.UniqueID
            WHERE g.id = ?;
            `;
            const results = await db.query(query, [idDiscord]);
            if (results.length > 0) {
                const row = results[0];
                const guildData = new Guild(row.g_UniqueID, row.g_id, row.g_name, row.g_description);
                const guildConfigData = new GuildConfig(row.gc_UniqueID, row.gc_nsfwEnable, row.gc_premiumLevelId);
                const guildExtraData = new GuildExtra(row.ge_UniqueID, row.ge_guildId, row.ge_ownerId, row.ge_verified, row.ge_partnered, row.ge_memberCount, row.ge_maximumMembers, row.ge_afkTimeout, row.ge_createdAt);
                const premiumLevelData = new PremiumLevel(row.pl_UniqueID, row.pl_levelName, row.pl_gptLevel, row.pl_nsfwLevel, row.pl_infiniteGpt, row.pl_gptTokens, row.pl_nsfwTokens);
                const guildDto = new GuildDto(guildData, guildConfigData, guildExtraData, premiumLevelData);
                return guildDto;
            }
            return null;
        } catch (error) {
            console.error(error);
        } finally {
            await db.close();
        }
    }
}

module.exports = GuildDao;
