const Sequelize = require('sequelize');
const { MODEL_NAMES } = require('../constants');

class Job extends Sequelize.Model {}

module.exports = (sequelize) => Job.init(
  {
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    paymentDate: {
      type: Sequelize.DATE,
    },
  },
  {
    sequelize,
    modelName: MODEL_NAMES.JOB,
  },
);
