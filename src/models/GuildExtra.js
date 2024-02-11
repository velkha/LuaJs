class GuildExtra {
    /**
     * 
     * @param {*} uniqueID id del extra en nuestra BBDD
     * @param {*} guildId id de la guild a la que corresponde
     * @param {*} ownerId id del usuario owner de la guild
     * @param {*} verified si la guild esta verirficada
     * @param {*} partnered si la guild esta asociada
     * @param {*} memberCount numero de miembros de la guild
     * @param {*} maximumMembers numero maximo de miembros
     * @param {*} afkTimeout tiempo de inactividad antes de mover al canal de afk
     * @param {*} createdAt fecha de creacion de la guild
     */
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