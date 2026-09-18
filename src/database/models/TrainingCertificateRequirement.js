import { DataTypes, Model } from "sequelize";

import { v4 as uuid } from "uuid";

import { sequelize } from "../../config/database.js";

class TrainingCertificateRequirement extends Model {}

TrainingCertificateRequirement.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TrainingCertificateRequirement",
    tableName: "training_certificate_requirements",
    underscored: true,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

export { TrainingCertificateRequirement };
