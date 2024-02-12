const { User, setupAssociations: setupUserAssociations } = require('../models/User');
const { Conversation, setupAssociations: setupConversationAssociations } = require('../models/Conversation');
const ConversationUsers = require('../models/ConversationUser');

// Set up model associations
const SetupAssociations = () => {
  setupUserAssociations(Conversation, ConversationUsers);
  setupConversationAssociations(User, ConversationUsers);
};

module.exports =  SetupAssociations ;