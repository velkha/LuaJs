class GuildConfig {
    constructor(uniqueID, nsfwEnable, premiumLevelId) {
        this.uniqueID = uniqueID;
        this.nsfwEnable = nsfwEnable;
        this.premiumLevelId = premiumLevelId;
    }
}
module.exports = GuildConfig;