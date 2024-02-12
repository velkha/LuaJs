const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');


const User = Sequelize.define('User', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id: {
    type: Datatypes.STRING(30),
    allowNull: false
  },
  username: {
    type: Datatypes.STRING(255),
    allowNull: false
  },
  globalName: Datatypes.STRING(255),
  bot: Datatypes.BOOLEAN
}, {
  // Options
});

//Problemas de dependencias circulares
function setupAssociations(Conversation, ConversationUser) {
  User.belongsToMany(Conversation, { 
    through: ConversationUser,
    foreignKey: 'idUser', // Explicitly specify the foreign key
    otherKey: 'idConversation'
  });
}

module.exports = { User, setupAssociations };