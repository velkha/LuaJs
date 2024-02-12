const {Conversation} = require('../models/Conversation'); // Sequelize model
const ConversationDto = require('../dto/ConversationDto');
const {User} = require('../models/User'); // Sequelize model
const ConversationUser = require('../models/ConversationUser');

class ConversationDao {
    /**
     * Get all conversations
     * @returns {Promise<Conversation[]>}
     */
    static async getAllConversations() {
        try {
            const conversations = await Conversation.findAll();
            return conversations.map(conversation => new ConversationDto(conversation));
        } catch (error) {
            console.error('Error fetching all conversations:', error);
            throw error;
        }
    }

    /**
     * Get a conversation by its UniqueID
     * @param {int} uniqueId 
     * @returns {Promise<ConversationDto>}
     */
    static async getConversationById(uniqueId) {
        try {
            const conversation = await Conversation.findOne({ where: { UniqueID: uniqueId } });
            return conversation ? new ConversationDto(conversation) : null;
        } catch (error) {
            console.error(`Error fetching conversation with UniqueID ${uniqueId}:`, error);
            throw error;
        }
    }

    /**
     * Get all conversations involving a user
     * @param {string} userDiscordId 
     * @returns {Promise<ConversationDto[]>}
     */
    static async getConversationsForUserByDiscordId(userDiscordId) {
        try {
            const conversations = await Conversation.findAll({
                include: [{
                    model: User,
                    where: { id: userDiscordId }, 
                    through: { model: ConversationUser }
                }]
            });
            return conversations.map(conversation => new ConversationDto(conversation));
        } catch (error) {
            console.error('Error fetching conversations for user by discordID:', error);
            throw error;
        }
    }

    /**
     * Get a conversation with all involved users included in the 'users' field of ConversationDto
     * @param {int} conversationId 
     * @returns {Promise<ConversationDto>}
     */
    static async getConversationWithUsers(conversationId) {
        try {
            const conversation = await Conversation.findOne({
                where: { UniqueID: conversationId },
                include: [User]
            });
            return conversation ? new ConversationDto(conversation, conversation.Users) : null;
        } catch (error) {
            console.error('Error fetching conversation with users:', error);
            throw error;
        }
    }
}

module.exports = ConversationDao;
