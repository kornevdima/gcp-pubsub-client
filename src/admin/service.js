const { Op } = require('sequelize');
const { sequelize } = require('../models');
const { RELATION_NAMES } = require('../constants');

const getBestProfession = async ({
  jobModel,
  contractModel,
  profileModel,
  startDate,
  endDate,
}) => jobModel.findOne({
  attributes: [[sequelize.fn('sum', sequelize.col('price')), 'sumPrice']],
  where: {
    paymentDate: {
      [Op.between]: [
        startDate, endDate],
    },
    paid: 1,
  },
  include: {
    model: contractModel,
    include: {
      model: profileModel, as: RELATION_NAMES.CONTRACTOR,
    },
  },
  group: 'Contract.Contractor.profession',
  order: [[sequelize.fn('max', 'sumPrice'), 'DESC']],
});

const getBestClients = async ({
  jobModel,
  contractModel,
  profileModel,
  startDate,
  endDate,
  limit = 2,
}) => jobModel.findAll({
  attributes: {
    include: [
      [sequelize.fn('sum', sequelize.col('price')), 'paid'],
      [
        sequelize.literal('firstName || \' \' || lastName'), 'fullName'],
      [sequelize.col('Contract.ClientId'), 'id']],
    exclude: [
      'id',
      'description',
      'price',
      'paid',
      'paymentDate',
      'createdAt',
      'updatedAt',
      'ContractId'],
  },
  where: {
    paymentDate: {
      [Op.between]: [
        startDate, endDate],
    },
    paid: 1,
  },
  include: {
    model: contractModel,
    include: {
      model: profileModel,
      as: RELATION_NAMES.CLIENT,
      attributes: {
        exclude: [
          'id',
          'firstName',
          'lastName',
          'profession',
          'balance',
          'type',
          'updatedAt',
          'createdAt'],
      },
    },
    attributes: {
      exclude: [
        'id',
        'terms',
        'status',
        'createdAt',
        'updatedAt',
        'ContractorId',
        'ClientId'],
    },
  },
  group: 'Contract.Client.id',
  order: [[sequelize.fn('max', 'paid'), 'DESC']],
  limit: +limit,
});

module.exports = {
  getBestProfession,
  getBestClients,
};
