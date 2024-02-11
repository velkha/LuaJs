class GuildExtra {
    constructor(uniqueID, guildId, ownerId, verified, partnered, memberCount, maximumMembers, afkTimeout, createdAt) {
        this.uniqueID = uniqueID;
        this.guildId = guildId;
        this.ownerId = ownerId;
        this.verified = verified;
        this.partnered = partnered;
        this.memberCount = memberCount;
        this.maximumMembers = maximumMembers;
        this.afkTimeout = afkTimeout;
        this.createdAt = createdAt;
    }
}
module.exports = GuildExtra;