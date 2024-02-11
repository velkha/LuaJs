class PremiumLevel {
    constructor(uniqueID, levelName, gptLevel, nsfwLevel, infiniteGpt, gptTokens, nsfwTokens) {
        this.uniqueID = uniqueID;
        this.levelName = levelName;
        this.gptLevel = gptLevel;
        this.nsfwLevel = nsfwLevel;
        this.infiniteGpt = infiniteGpt;
        this.gptTokens = gptTokens;
        this.nsfwTokens = nsfwTokens;
    }
}

module.exports = PremiumLevel;
