import { Sequelize } from "sequelize";

import { env } from "./env.js";

const sequelize = new Sequelize(
  env.DB_DATABASE,
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",

    logging: env.NODE_ENV === "development" ? console.log : false,

    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    },

    timezone: "+00:00",
  },
);

export { sequelize };
