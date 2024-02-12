const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');

const Conversation = Sequelize.define('Conversation', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id: {
    type: Datatypes.STRING(30),
    allowNull: false
  },
  sessionId: Datatypes.STRING(255),
  contexto: Datatypes.JSON,
  fecha_creacion: Datatypes.DATE,
  fecha_modificacion: Datatypes.DATE,
  chatLog: Datatypes.JSON,
  tokens_usados: Datatypes.INTEGER
}, {
  tableName: 'Conversation'
});

//Problemas de dependencias circulares
function setupAssociations(User, ConversationUsers) {
  Conversation.belongsToMany(User, { 
    through: ConversationUsers,
    foreignKey: 'idConversation', // Explicitly specify the foreign key
    otherKey: 'idUser'
  });
}

module.exports = { Conversation, setupAssociations };
