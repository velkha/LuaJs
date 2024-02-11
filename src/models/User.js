class User {
    constructor(uniqueID, id, username, globalName, bot) {
        this.uniqueID = uniqueID; // Primary Key, auto-incremented
        this.id = id; // User identifier
        this.username = username; // Username
        this.globalName = globalName; // Global name of the user
        this.bot = bot; // Boolean indicating if the user is a bot
    }
}

module.exports = User;
