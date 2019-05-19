import { PORT, MONGODB_URI } from "./configuration/envs";
import { connect } from "./db";
import app from "./app";

connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
