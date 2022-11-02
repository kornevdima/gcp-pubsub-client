const service = require('./service');

const getContractById = async (req, res) => {
  const { Contract } = req.app.get('models');
  const { profile } = req;
  const { id } = req.params;

  const contract = await service.getContractById({
    contractModel: Contract, requesterId: profile.id, contractId: id,
  });

  if (!contract) {
    return res.status(404).end();
  }

  return res.json(contract).end();
};

const getContracts = async (req, res) => {
  const { Contract } = req.app.get('models');
  const { profile } = req;

  const contract = await service.getContracts({
    contractModel: Contract, requesterId: profile.id,
  });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract).end();
};

module.exports = {
  getContractById, getContracts,
};
