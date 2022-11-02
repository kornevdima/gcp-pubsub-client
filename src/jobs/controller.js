const service = require('./service');

const getUnpaidJobs = async (req, res) => {
  const { Contract, Job } = req.app.get('models');
  const { profile } = req;

  const jobs = await service.getUnpaidJobs({
    contractModel: Contract,
    jobModel: Job,
    requesterId: profile.id,
  });

  if (!jobs.length) {
    return res.status(404).end();
  }

  return res.json(jobs).end();
};

const payForJob = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { profile } = req;
  const { job_id } = req.params;

  const job = await service.payForJob({
    contractModel: Contract,
    jobModel: Job,
    profileModel: Profile,
    requesterId: profile.id,
    jobId: job_id,
  });

  if (!job) {
    return res.status(404).end();
  }

  if (job.failed) {
    return res.status(403).end();
  }

  return res.status(200).end();
};

module.exports = {
  getUnpaidJobs,
  payForJob,
};
