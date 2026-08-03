import { DataTypes } from "sequelize";
import { v4 as uuid } from "uuid";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("job_types", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  await queryInterface.bulkInsert("job_types", [
    {
      id: uuid(),

      name: "Default",

      is_default: true,

      created_at: new Date(),

      updated_at: new Date(),
    },
  ]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("job_types");
};
