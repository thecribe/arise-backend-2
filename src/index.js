import { sequelize } from "./config/database.js";
import { startServer } from "./app/server.js";
import { registerAssociations } from "./database/associations.js";
import "./features/auth/jobs/index.js";
import { startWorker } from "./infrastructure/jobs/job.worker.js";

const bootstrap = async () => {
  try {
    registerAssociations();
    await sequelize.authenticate();

    console.log("✅ Database connected.");

    startServer();

    void startWorker();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

bootstrap();
