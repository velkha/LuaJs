const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');
const GuildConfig = require('./GuildConfig'); // Import the related model
const GuildExtra = require('./GuildExtra');
const PremiumLevels = require('./PremiumLevels');

const Guild = Sequelize.define('Guild', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id: {
    type: Datatypes.STRING(30),
    allowNull: false
  },
  name: {
    type: Datatypes.STRING(255),
    allowNull: false
  },
  description: Datatypes.TEXT
}, {
  tableName: 'Guild'
});

Guild.hasOne(GuildConfig, {
  foreignKey: 'UniqueID',
  as: 'config' 
});
Guild.hasOne(GuildExtra, {
  foreignKey: 'guildId',
  as: 'extra'
});
GuildConfig.belongsTo(PremiumLevels, {
  foreignKey: 'premiumLevelId', 
  as: 'premiumLevel'
});

module.exports = Guild;