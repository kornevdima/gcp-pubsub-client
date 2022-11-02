const { DateTime } = require('luxon');
const service = require('./service');

const getBestProfession = async (req, res) => {
  // I decided to proceed with req as DI container
  // Repository level might be implemented
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(404).end();
  }

  // Can be done as middleware. Error contract should be defined. 404 is a mock
  const parsedDates = {
    start: DateTime.fromSQL(start, {
      zone: 'utc',
    }),
    end: DateTime.fromSQL(end, {
      zone: 'utc',
    }),
  };

  if (!!parsedDates.start.invalid || !!parsedDates.end.invalid) {
    return res.status(404).end();
  }

  const bestProfession = await service.getBestProfession({
    jobModel: Job,
    contractModel: Contract,
    profileModel: Profile,
    startDate: parsedDates.start.toJSDate(),
    endDate: parsedDates.end.toJSDate(),
  });

  if (!bestProfession) {
    return res.status(404).end();
  }

  return res.json({
    profession: bestProfession.Contract.Contractor.profession,
    totalEarned: bestProfession.sumPrice,
  }).end();
};

const getBestClients = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end, limit = 2 } = req.query;

  // Can be done as middleware. Error contract should be defined. 404 is a mock
  if (!start || !end) {
    return res.status(404).end();
  }

  const parsedDates = {
    start: DateTime.fromSQL(start, {
      zone: 'utc',
    }),
    end: DateTime.fromSQL(end, {
      zone: 'utc',
    }),
  };

  if (!!parsedDates.start.invalid || !!parsedDates.end.invalid) {
    return res.status(404).end();
  }

  // I have a doubt about need of filtering out jobs with same Contract id.
  const bestClients = await service.getBestClients({
    jobModel: Job,
    contractModel: Contract,
    profileModel: Profile,
    startDate: parsedDates.start.toJSDate(),
    endDate: parsedDates.end.toJSDate(),
    limit,
  });

  if (!bestClients.length) {
    return res.status(404).end();
  }

  return res.json(bestClients).end();
};

module.exports = {
  getBestClients,
  getBestProfession,
};
