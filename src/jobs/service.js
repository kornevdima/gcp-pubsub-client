const { Op, Transaction } = require('sequelize');
const { CONTRACT_STATUSES, RELATION_NAMES } = require('../constants');
const { sequelize } = require('../models');

const getUnpaidJobs = async ({
  jobModel,
  contractModel,
  requesterId,
}) => jobModel.findAll({
  where: { paid: null },
  include: {
    model: contractModel,
    where: {
      status: CONTRACT_STATUSES.in_progress,
      [Op.or]: [{ ContractorId: requesterId }, { ClientId: requesterId }],
    },
    attributes: {
      exclude: [
        'ClientId',
        'ContractorId',
        'createdAt',
        'id',
        'status',
        'terms',
        'updatedAt'],
    },
  },
});

const payForJob = async ({
  jobModel,
  profileModel,
  contractModel,
  requesterId,
  jobId,
}) => {
  const t = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const job = await jobModel.findOne({
      where: { paid: null, id: jobId },
      include: [
        {
          model: contractModel,
          include: [RELATION_NAMES.CLIENT, RELATION_NAMES.CONTRACTOR],
          where: {
            ClientId: requesterId, status: CONTRACT_STATUSES.in_progress,
          },
        }],
    });
    if (!job) {
      return null;
    }

    if (job.Contract.Client.balance < job.price) {
      return {
        failed: true, // Custom errors should be implemented
      };
    }

    await profileModel.update({
      balance: job.Contract.Contractor.balance + job.price,
    }, {
      where: {
        id: job.Contract.Contractor.id,
      },
    });
    await profileModel.update({
      balance: job.Contract.Contractor.balance - job.price,
    }, {
      where: {
        id: job.Contract.Client.id,
      },
    });
    await jobModel.update({
      paid: 1, paymentDate: Date.now(),
    }, {
      where: {
        id: jobId,
      },
    });
    await contractModel.update({
      status: CONTRACT_STATUSES.terminated,
    }, {
      where: {
        id: job.Contract.id,
      },
    });

    t.commit();
    return true;
  } catch (e) {
    console.error(e);
    t.rollback();
  }

  return null;
};

module.exports = {
  getUnpaidJobs,
  payForJob,
};
