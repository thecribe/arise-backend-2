import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("tokens", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    used_at: {
      type: DataTypes.DATE,
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

  await queryInterface.addIndex("tokens", ["user_id"]);
  await queryInterface.addIndex("tokens", ["type"]);
  await queryInterface.addIndex("tokens", ["expires_at"]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("tokens");
};
