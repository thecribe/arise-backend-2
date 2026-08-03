import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("jobs", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    payload: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    max_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },

    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    last_error: {
      type: DataTypes.TEXT("long"),
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

  await queryInterface.addIndex("jobs", ["status"]);
  await queryInterface.addIndex("jobs", ["type"]);
  await queryInterface.addIndex("jobs", ["scheduled_at"]);
  await queryInterface.addIndex("jobs", ["priority"]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("jobs");
};
