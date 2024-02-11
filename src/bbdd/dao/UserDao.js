const Database = require('../Database');
const UserDTO = require('../dto/UserDTO');

class UserDAO {

    static async getAllUsers() {
        const db = new Database();
        try {
            const results = await db.query('SELECT * FROM Users');
            return results.map(row => new UserDTO(row.UniqueID, row.id, row.username, row.globalName, row.bot));
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        } finally {
            await db.close();
        }
    }

    static async getUserById(uniqueId) {
        const db = new Database();
        try {
            const results = await db.query('SELECT * FROM Users WHERE UniqueID = ?', [uniqueId]);
            if (results.length) {
                const row = results[0];
                return new UserDTO(row.UniqueID, row.id, row.username, row.globalName, row.bot);
            }
            return null;
        } catch (error) {
            console.error(`Error fetching user with UniqueID ${uniqueId}:`, error);
            throw error;
        } finally {
            await db.close();
        }
    }

    static async getUserById(userDiscordId) {
        const db = new Database();
        try {
            const results = await db.query('SELECT * FROM Users WHERE id = ?', [userDiscordId]);
            if (results.length) {
                const row = results[0];
                return new UserDTO(row.UniqueID, row.id, row.username, row.globalName, row.bot);
            }
            return null;
        } catch (error) {
            console.error(`Error fetching user with UniqueID ${uniqueId}:`, error);
            throw error;
        } finally {
            await db.close();
        }
    }

    static async addUser(userDTO) {
        const db = new Database();
        try {
            const result = await db.query(
                'INSERT INTO Users (id, username, globalName, bot) VALUES (?, ?, ?, ?)',
                [userDTO.id, userDTO.username, userDTO.globalName, userDTO.bot]
            );
            // Assign the insertId to the uniqueID property of the UserDTO
            userDTO.uniqueID = result.insertId;
            return userDTO;
        } catch (error) {
            console.error('Error adding a new user:', error);
            throw error;
        } finally {
            await db.close();
        }
    }


    /**
     * Devuelve todos los usuarios involucrados en una conversacion concreta
     * @param {*} conversationId 
     * @returns 
     * Usage
        ConversationDao.getUsersForConversation(conversationId)
            .then(users => {
                // Process users
            })
            .catch(error => {
                // Handle error
            });
     */
    static async getUsersForConversation(conversationId) {
        const db = new Database();
        try {
            const query = `
                SELECT u.* 
                FROM Users u
                INNER JOIN conversation_users cu ON u.UniqueID = cu.idUser
                WHERE cu.idConversation = ?;
            `;
            const results = await db.query(query, [conversationId]);
            return results.map(row => new User(row.UniqueID, row.id, row.username, row.globalName, row.bot));
        } catch (error) {
            console.error('Error fetching users for conversation:', error);
            throw error;
        } finally {
            await db.close();
        }
    }
}

module.exports = UserDAO;
