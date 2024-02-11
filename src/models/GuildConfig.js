class GuildConfig {
    /**
     * 
     * @param {*} uniqueID id d ela guild correspondiente
     * @param {*} nsfwEnable si el servidor tiene habilitado el contenido nsfw
     * @param {*} premiumLevelId id del nivel de premium del servidor
     */
    constructor(uniqueID, nsfwEnable, premiumLevelId) {
        this.uniqueID = uniqueID;
        this.nsfwEnable = nsfwEnable;
        this.premiumLevelId = premiumLevelId;
    }
}
module.exports = GuildConfig;