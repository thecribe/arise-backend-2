import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable(
    "applicant_application_reference_mail_statuses",
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

      status: {
        type: DataTypes.ENUM("Not sent", "Pending", "Received", "Refused"),
        allowNull: false,
        defaultValue: "Not sent",
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
    "applicant_application_reference_mail_statuses",
    {
      fields: ["reference_id"],
      type: "unique",
      name: "uq_reference_mail_status_reference_id",
    },
  );
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(
    "applicant_application_reference_mail_statuses",
  );
};
