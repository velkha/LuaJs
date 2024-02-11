const Database = require('../Database');
const ConversationDto = require('../dto/ConversationDto');
const Conversation = require('../../models/Conversation');

class ConversationDao {

    /**
     * Devuelve todas las conversaciones
     * @returns {Promise<Conversation[]>}
     */
    static async getAllConversations() {
        const db = new Database();
        try {
            const results = await db.query('SELECT * FROM Conversation');
            return results.map(row => new Conversation(row.uniqueID, row.id, row.sessionId, row.contexto, row.fecha_creacion, row.fecha_modificacion, row.chatLog, row.tokens_usados));
        } catch (error) {
            console.error('Error fetching all conversations:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    /**
     * Devuelve una conversacion por su UniqueID
     * @param {int} uniqueId 
     * @returns {Promise<Conversation>}
     */
    static async getConversationById(uniqueId) {
        const db = new Database();
        try {
            const results = await db.query('SELECT * FROM Conversation WHERE UniqueID = ?', [uniqueId]);
            if (results.length > 0) {
                const row = results[0];
                const conversation = new Conversation(row.uniqueID, row.id, row.sessionId, row.contexto, row.fecha_creacion, row.fecha_modificacion, row.chatLog, row.tokens_usados);
                return new ConversationDto(conversation, null); // Assuming ConversationDto takes a conversation and a list of users
            }
            return null;
        } catch (error) {
            console.error(`Error fetching conversation with UniqueID ${uniqueId}:`, error);
            throw error;
        } finally {
            await db.close();
        }
    }
    
    /**
     * Devuelve todas las conversaciones en las que esta involucrado un usuario
     * @param {string} userDiscordId 
     * @returns {Promise<Conversation[]>}
     * 
     * Usage:
        ConversationDao.getConversationsForUser(userId)
            .then(conversations => {
                // Process conversations
            })
            .catch(error => {
                // Handle error
            });
     */
    static async getConversationsForUser(userDiscordId) {
        const db = new Database();
        try {
            const query = `
                SELECT c.* 
                FROM Conversation c
                INNER JOIN conversation_users cu ON c.UniqueID = cu.idConversation
                INNER JOIN Users u ON cu.idUser = u.UniqueID
                WHERE u.id = ?;
            `;
            const results = await db.query(query, [userDiscordId]);
            return results.map(row => new Conversation(row.uniqueID, row.id, row.sessionId, row.contexto, row.fecha_creacion, row.fecha_modificacion, row.chatLog, row.tokens_usados));
        } catch (error) {
            console.error('Error fetching conversations for user:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
    
    /**
     * Devuelve una conversacion con todos los usuarios involucrados incluidos en el campo users del ConversationDto
     * @param {int} conversationId 
     * @returns {Promise<Conversation>}
     */
    static async getConversationWithUsers(conversationId) {
        const db = new Database();
        try {
            const conversationQuery = 'SELECT * FROM Conversation WHERE UniqueID = ?';
            const conversationResults = await db.query(conversationQuery, [conversationId]);
            if (conversationResults.length > 0) {
                const conversationData = conversationResults[0];
                const conversation = new ConversationDto(conversationData.uniqueID, conversationData.id, conversationData.sessionId, conversationData.contexto, conversationData.fecha_creacion, conversationData.fecha_modificacion, conversationData.chatLog, conversationData.tokens_usados);

                const userQuery = `
                    SELECT u.* 
                    FROM Users u
                    INNER JOIN conversation_users cu ON u.UniqueID = cu.idUser
                    WHERE cu.idConversation = ?;
                `;
                const userResults = await db.query(userQuery, [conversationId]);
                const users = userResults.map(row => new User(row.UniqueID, row.id, row.username, row.globalName, row.bot));
                conversation.users = users;
                return conversation;
            }
            return null; 
        } catch (error) {
            console.error('Error fetching conversation with users:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
    
}

module.exports = ConversationDao;
