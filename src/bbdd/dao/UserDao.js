const {User} = require('../models/User'); // Sequelize model
const UserDTO = require('../dto/UserDTO');
const ConversationUser = require('../models/ConversationUser');

class UserDAO {
    /**
     * Get all Users from the database
     * @returns {Promise<UserDTO[]>} Promise resolving with an array of UserDTOs
     */
    static async getAllUsers() {
        try {
            const users = await User.findAll();
            return users.map(user => new UserDTO(user.UniqueID, user.id, user.username, user.globalName, user.bot));
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    /**
     * Get a User by their unique ID
     * @param {int} uniqueId 
     * @returns {Promise<UserDTO>} Promise resolving with a UserDTO or null if not found
     */
    static async getUserById(uniqueId) {
        try {
            const user = await User.findOne({ where: { UniqueID: uniqueId } });
            return user ? new UserDTO(user.UniqueID, user.id, user.username, user.globalName, user.bot) : null;
        } catch (error) {
            console.error(`Error fetching user with UniqueID ${uniqueId}:`, error);
            throw error;
        }
    }

    /**
     * Get a User by their Discord ID
     * @param {string} userDiscordId 
     * @returns {Promise<UserDTO>} Promise resolving with a UserDTO or null if not found
     */
    static async getUserById_discord(userDiscordId) {
        try {
            const user = await User.findOne({ where: { id: userDiscordId } });
            return user ? new UserDTO(user.UniqueID, user.id, user.username, user.globalName, user.bot) : null;
        } catch (error) {
            console.error(`Error fetching user with Discord ID ${userDiscordId}:`, error);
            throw error;
        }
    }

    /**
     * Add a new User to the database
     * @param {UserDTO} userDTO 
     * @returns {Promise<UserDTO>} Promise resolving with the UserDTO of the added user
     */
    static async addUser(userDTO) {
        try {
            const newUser = await User.create({
                id: userDTO.id,
                username: userDTO.username,
                globalName: userDTO.globalName,
                bot: userDTO.bot
            });
            return new UserDTO(newUser.UniqueID, newUser.id, newUser.username, newUser.globalName, newUser.bot);
        } catch (error) {
            console.error('Error adding a new user:', error);
            throw error;
        }
    }

    /**
     * Get all Users involved in a specific conversation
     * @param {*} conversationId 
     * @returns 
     */
    static async getUsersForConversation(conversationId) {
        try {
            const users = await User.findAll({
                include: [{
                    model: ConversationUser,
                    where: { idConversation: conversationId }
                }]
            });
            return users.map(user => new UserDTO(user.UniqueID, user.id, user.username, user.globalName, user.bot));
        } catch (error) {
            console.error('Error fetching users for conversation:', error);
            throw error;
        }
    }
}

module.exports = UserDAO;
