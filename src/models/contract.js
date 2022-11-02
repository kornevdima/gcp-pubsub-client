const Sequelize = require('sequelize');
const { CONTRACT_STATUSES, MODEL_NAMES } = require('../constants');

class Contract extends Sequelize.Model {}

module.exports = (sequelize) => Contract.init({
  terms: {
    type: Sequelize.TEXT, allowNull: false,
  },
  status: {
    type: Sequelize.ENUM(
      CONTRACT_STATUSES.new,
      CONTRACT_STATUSES.in_progress,
      CONTRACT_STATUSES.terminated,
    ),
  },
}, {
  sequelize, modelName: MODEL_NAMES.CONTRACT,
});
