import { DataTypes } from "sequelize";
import { v4 as uuid } from "uuid";
import { PERMISSIONS } from "../../common/constants/permissions.js";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("permissions", {
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

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
  });

  await queryInterface.bulkInsert(
    "permissions",
    Object.values(PERMISSIONS).map((permission) => ({
      id: uuid(),
      name: permission.name,
      description: permission.description,
      created_at: new Date(),
      updated_at: new Date(),
    })),
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("permissions");
};
