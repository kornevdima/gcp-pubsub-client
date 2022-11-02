const superagent = require('superagent');

// To run the tests please start server before
describe('contracts', () => {
  it('should return 404', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/contracts/1',
      ).set({
        profile_id: 2,
      });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.message).toEqual('Not Found');
    expect(res.status).toEqual(404);
  });

  it('should return associated contracts', async () => {
    let res;

    try {
      const response = await superagent.get('http://127.0.0.1:3001/contracts')
        .set({
          profile_id: 5,
        });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res[0].ClientId).toEqual(1);
  });

  it('should return associated contract', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/contracts/1',
      ).set({
        profile_id: 5,
      });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.ClientId).toEqual(1);
  });

  it('should return jobs', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/jobs/unpaid',
      ).set({
        profile_id: 2,
      });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res[0].id).toEqual(3);
  });

  it('should return 404 if no jobs', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/jobs/unpaid',
      ).set({
        profile_id: 3,
      });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(404);
  });

  it('should return 404 for wrong job', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/jobs/1/pay',
      ).set({
        profile_id: 3,
      });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(404);
  });

  it('should 403 if not enough money', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/jobs/5/pay',
      ).set({
        profile_id: 4,
      });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(403);
  });

  it('should pay if enough money', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/jobs/2/pay',
      ).set({
        profile_id: 1,
      });

      res = {
        status: response.status,
      };
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(200);
  });

  it('should add deposit', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/balances/deposit/2',
      ).set({
        profile_id: 2,
      }).send({ amount: 50 });

      res = {
        status: response.status,
      };
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(200);
  });

  it('should return error if deposit higher than 25%', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/balances/deposit/2',
      ).set({
        profile_id: 2,
      }).send({ amount: 500 });

      res = {
        status: response.status,
      };
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(403);
  });

  it('should return 404 if no dates passed', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/admin/best-profession',
      ).set({
        profile_id: 1,
      });

      res = {
        status: response.status,
      };
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.status).toEqual(404);
  });

  it('should calculate best profession', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/admin/best-profession',
      ).set({
        profile_id: 1,
      }).query({ start: '2020-08-09', end: '2020-08-18' });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res.profession).toEqual('Programmer');
  });

  it('should calculate best clients', async () => {
    let res;

    try {
      const response = await superagent.get(
        'http://127.0.0.1:3001/admin/best-clients',
      ).set({
        profile_id: 1,
      }).query({ start: '2020-08-09', end: '2020-08-16', limit: 3 });

      res = response.body;
    } catch (err) {
      res = {
        message: err.message, status: err.status,
      };
    }

    expect(res).toEqual([
      {
        fullName: 'Ash Kethcum', id: 4, paid: 2020,
      }, {
        fullName: 'Mr Robot', id: 2, paid: 242,
      }, {
        fullName: 'Harry Potter', id: 1, paid: 242,
      }]);
  });
});
