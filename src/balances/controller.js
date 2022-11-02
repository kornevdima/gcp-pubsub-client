const { Transaction } = require('sequelize');
const { sequelize } = require('../models');
const { RELATION_NAMES, CONTRACT_STATUSES, DEPOSIT_LIMIT } = require(
  '../constants',
);
const service = require('./service');

const topUpBalance = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { profile } = req;
  const { amount } = req.body;
  const { userId } = req.params;

  if (+profile.id !== +userId) {
    return res.status(403).end();
  }

  const result = await service.topUpBalance({
    contractModel: Contract,
    jobModel: Job,
    profileModel: Profile,
    topUpAmount: amount,
    userId,
  });

  if (!result) {
    return res.status(404).end();
  }

  if (result.failed) {
    return res.status(403).end();
  }

  return res.status(200).end();
};

module.exports = {
  topUpBalance,
};
