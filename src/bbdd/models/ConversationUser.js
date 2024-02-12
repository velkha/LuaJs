const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');

const ConversationUser = Sequelize.define('conversation_User', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUser: {
    type: Datatypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UniqueID'
    }
  },
  idConversation: {
    type: Datatypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Conversation',
      key: 'UniqueID'
    }
  },
  owner: {
    type: Datatypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Conversation_Users'
});

module.exports = ConversationUser;