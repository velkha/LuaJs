const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');

const GuildConfig = Sequelize.define('GuildConfig', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Guild',
      key: 'UniqueID'
    }
  },
  nsfwEnable: Datatypes.BOOLEAN,
  premiumLevelId: {
    type: Datatypes.INTEGER,
    references: {
      model: 'PremiumLevels',
      key: 'UniqueID'
    }
  }
}, {
  tableName: 'GuildConfig'
});

module.exports = GuildConfig;