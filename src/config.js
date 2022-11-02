module.exports = {
  // this may be set from process.env in real-world scenarios
  db: {
    dialect: 'sqlite',
    storage: './database.sqlite3',
  },
  app: {
    port: 3001,
  },
};
