import mongoose from "mongoose";

export function connect(dbURI: string) {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;

    mongoose
      .connect(dbURI, { useCreateIndex: true, useNewUrlParser: true })
      .then(() => resolve(), (err) => reject(err));
  });
}

export function close() {
  mongoose.disconnect();
}
