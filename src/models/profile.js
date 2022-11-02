const Sequelize = require('sequelize');
const { PROFILE_TYPES, MODEL_NAMES } = require('../constants');

class Profile extends Sequelize.Model {}

module.exports = (sequelize) => Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2),
    },
    type: {
      type: Sequelize.ENUM(PROFILE_TYPES.client, PROFILE_TYPES.contractor),
    },
  },
  {
    sequelize,
    modelName: MODEL_NAMES.PROFILE,
  },
);
