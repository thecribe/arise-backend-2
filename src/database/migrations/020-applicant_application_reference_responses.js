import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable(
    "applicant_application_reference_responses",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      reference_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "applicant_application_references",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      re_employ: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false,
      },

      ratings: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },

      detail_reference: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      referer_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      referer_signature: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      signatureDate: {
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

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
  );

  await queryInterface.addConstraint(
    "applicant_application_reference_responses",
    {
      fields: ["reference_id"],
      type: "unique",
      name: "uq_reference_response_reference_id",
    },
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("applicant_application_reference_responses");
};
