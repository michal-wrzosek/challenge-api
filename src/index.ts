import { PORT, MONGO_DB } from "./configuration/envs";
import { connect } from "./db";
import app from "./app";

connect(MONGO_DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
