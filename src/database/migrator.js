import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

import { env } from "../config/env.js";

const sequelize = new Sequelize(
  env.DB_DATABASE,
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
);

const migrator = new Umzug({
  migrations: {
    glob: "src/database/migrations/*.js",
  },

  context: sequelize.getQueryInterface(),

  storage: new SequelizeStorage({
    sequelize,
  }),

  logger: console,
});

const command = process.argv[2];

switch (command) {
  case "up":
    await migrator.up();
    console.log("✅ Migrations completed.");
    break;

  case "down":
    await migrator.down();
    console.log("✅ Migration reverted.");
    break;

  default:
    console.log("Usage:");
    console.log("npm run migrate");
    console.log("npm run migrate:down");
}
