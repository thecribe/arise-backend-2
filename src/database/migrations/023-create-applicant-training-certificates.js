import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable(
    "applicant_application_training_certificates",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },

      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "applicant_applications",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      requirement_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "training_certificate_requirements",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      certificate_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      certificate_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      document: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },

      uploaded_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      deleted_at: {
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
    },
  );

  await queryInterface.addIndex(
    "applicant_application_training_certificates",
    ["application_id"],
    {
      name: "idx_training_certificates_application_id",
    },
  );

  await queryInterface.addIndex(
    "applicant_application_training_certificates",
    ["requirement_id"],
    {
      name: "idx_training_certificates_requirement_id",
    },
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("applicant_application_training_certificates");
};
