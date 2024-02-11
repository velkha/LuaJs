class PremiumLevel {
    /**
     * 
     * @param {*} uniqueID id del nivel de premium
     * @param {*} levelName nombre del nivel de premium
     * @param {*} gptLevel version de GPT al que tiene acceso
     * @param {*} nsfwLevel version de NSFW al que tiene acceso
     * @param {*} infiniteGpt si tiene acceso ilimitado a GPT (es decir al acabar tokens de gpt 4 pasa a gpt 3)
     * @param {*} gptTokens tokens de gpt que tiene
     * @param {*} nsfwTokens tokens de nsfw que tiene
     */
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
