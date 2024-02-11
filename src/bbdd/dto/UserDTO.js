class UserDTO {
    constructor(uniqueID, id, username, globalName, bot) {
        this.uniqueID = uniqueID;
        this.id = id;
        this.username = username;
        this.globalName = globalName;
        this.bot = bot;
    }
}

module.exports = UserDTO;
