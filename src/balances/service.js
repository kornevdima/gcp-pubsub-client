const { Transaction } = require('sequelize');
const { sequelize } = require('../models');
const { RELATION_NAMES, CONTRACT_STATUSES, DEPOSIT_LIMIT } = require(
  '../constants',
);

const topUpBalance = async ({
  contractModel, jobModel, profileModel, topUpAmount, userId,
}) => {
  const t = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });
  try {
    const job = await jobModel.findOne({
      attributes: [[sequelize.fn('sum', sequelize.col('price')), 'sumPrice']],
      where: { paid: null },
      include: [
        {
          model: contractModel,
          include: RELATION_NAMES.CLIENT,
          where: {
            ClientId: userId, status: CONTRACT_STATUSES.in_progress,
          },
        }],
    });

    if (!job) {
      return null;
    }

    if (Math.floor((100 * topUpAmount) / job.toJSON().sumPrice)
      > DEPOSIT_LIMIT) {
      return {
        failed: true,
      };
    }

    await profileModel.update({ balance: job.Contract.Client.balance + topUpAmount }, {
      where: {
        id: userId,
      },
    });

    t.commit();
    return true;
  } catch (e) {
    console.error(e);
    t.rollback();
  }
  return null; // Should be properly formatted error.
};

module.exports = {
  topUpBalance,
};
