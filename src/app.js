const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const { getProfile } = require('./middlewares/getProfile');
const { getContracts, getContractById } = require('./contracts/controller');
const { getUnpaidJobs, payForJob } = require('./jobs/controller');
const { topUpBalance } = require('./balances/controller');
const { getBestClients, getBestProfession } = require('./admin/controller');

// Router can be separated
// Error handler middleware should be implemented
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, getContractById);

app.get('/contracts', getProfile, getContracts);

app.get('/jobs/unpaid', getProfile, getUnpaidJobs);

app.get('/jobs/:job_id/pay', getProfile, payForJob);

app.get('/balances/deposit/:userId', getProfile, topUpBalance);

app.get('/admin/best-profession', getProfile, getBestProfession);

app.get('/admin/best-clients', getProfile, getBestClients);

module.exports = app;
