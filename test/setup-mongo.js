const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

let mongoServer;

before(done => {
  mongoServer = new MongoMemoryServer();
  mongoServer
    .getConnectionString()
    .then(mongoUri => {
      return mongoose.connect(
        mongoUri,
        { useCreateIndex: true, useNewUrlParser: true },
        err => {
          if (err) done(err);
        }
      );
    })
    .then(() => done());
});

afterEach(done => {
  mongoose.connection.db.dropDatabase(done);
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});
