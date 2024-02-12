const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');

const GuildExtra = Sequelize.define('GuildExtra', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  guildId: {
    type: Datatypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Guild',
      key: 'UniqueID'
    }
  },
  ownerId: Datatypes.INTEGER,
  verified: Datatypes.BOOLEAN,
  partnered: Datatypes.BOOLEAN,
  memberCount: Datatypes.INTEGER,
  maximumMembers: Datatypes.INTEGER,
  afkTimeout: Datatypes.INTEGER,
  creationAt: Datatypes.DATE
}, {
  tableName: 'GuildExtra'
});

module.exports = GuildExtra;
