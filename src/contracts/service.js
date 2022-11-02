const { Op } = require('sequelize');

const getContractById = async ({
  contractModel, requesterId, contractId,
}) => contractModel.findOne({
  where: {
    id: contractId,
    [Op.or]: [
      { ContractorId: requesterId }, { ClientId: requesterId }],
  },
});

const getContracts = async ({
  contractModel,
  requesterId,
}) => contractModel.findAll({
  where: {
    [Op.or]: [
      { ContractorId: requesterId }, { ClientId: requesterId }],
  },
});

module.exports = {
  getContractById,
  getContracts,
};
