const Sequelize = require('sequelize');
const { db } = require('../config');
const contract = require('./contract');
const job = require('./job');
const profile = require('./profile');
const { RELATION_NAMES } = require('../constants');

const sequelize = new Sequelize(db);

const Contract = contract(sequelize);
const Job = job(sequelize);
const Profile = profile(sequelize);

Profile.hasMany(
  Contract,
  { as: RELATION_NAMES.CONTRACTOR, foreignKey: 'ContractorId' },
);
Contract.belongsTo(Profile, { as: RELATION_NAMES.CONTRACTOR });
Profile.hasMany(
  Contract,
  { as: RELATION_NAMES.CLIENT, foreignKey: 'ClientId' },
);
Contract.belongsTo(Profile, { as: RELATION_NAMES.CLIENT });
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
  sequelize, Profile, Contract, Job,
};
