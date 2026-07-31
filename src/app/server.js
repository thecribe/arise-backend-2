import { app } from "./app.js";
import { env } from "../config/env.js";

const startServer = () => {
  app.listen(env.PORT, () => {
    console.log(`🚀 ${env.APP_NAME} running at ${env.APP_URL}`);
  });
};

export { startServer };
