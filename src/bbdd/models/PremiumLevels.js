const Sequelize = require('../Database.js');
const Datatypes = require('sequelize');

const PremiumLevels = Sequelize.define('PremiumLevels', {
  UniqueID: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  levelName: Datatypes.STRING(255),
  gptLevel: Datatypes.STRING(20),
  nsfwLevel: Datatypes.STRING(20),
  infiniteGpt: Datatypes.BOOLEAN,
  gptTokens: Datatypes.INTEGER,
  nsfwTokens: Datatypes.INTEGER
}, {
  // Options
});

module.exports = PremiumLevels;