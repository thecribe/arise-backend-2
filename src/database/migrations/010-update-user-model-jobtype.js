import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  /**
   * --------------------------------------------------------------------------
   * Step 1
   * Add the new column as nullable so existing users do not violate the
   * NOT NULL constraint.
   * --------------------------------------------------------------------------
   */
  await queryInterface.addColumn("users", "job_type_id", {
    type: DataTypes.UUID,
    allowNull: true,
  });

  /**
   * --------------------------------------------------------------------------
   * Step 2
   * Retrieve the default job type.
   * --------------------------------------------------------------------------
   */
  const [[defaultJobType]] = await queryInterface.sequelize.query(`
    SELECT id
    FROM job_types
    WHERE is_default = true
    LIMIT 1
  `);

  if (!defaultJobType) {
    throw new Error("Default job type not found.");
  }

  /**
   * --------------------------------------------------------------------------
   * Step 3
   * Assign every existing user to the default job type.
   * --------------------------------------------------------------------------
   */
  await queryInterface.sequelize.query(
    `
      UPDATE users
      SET job_type_id = :jobTypeId
      WHERE job_type_id IS NULL
    `,
    {
      replacements: {
        jobTypeId: defaultJobType.id,
      },
    },
  );

  /**
   * --------------------------------------------------------------------------
   * Step 4
   * Now that every user has a job type, make the column NOT NULL.
   * --------------------------------------------------------------------------
   */
  await queryInterface.changeColumn("users", "job_type_id", {
    type: DataTypes.UUID,
    allowNull: false,
  });

  /**
   * --------------------------------------------------------------------------
   * Step 5
   * Finally add the foreign key constraint.
   * --------------------------------------------------------------------------
   */
  await queryInterface.addConstraint("users", {
    fields: ["job_type_id"],
    type: "foreign key",
    name: "fk_users_job_type",
    references: {
      table: "job_types",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  });
};

export const down = async ({ context: queryInterface }) => {
  /**
   * Remove the foreign key.
   */
  await queryInterface.removeConstraint("users", "fk_users_job_type");

  /**
   * Remove the column.
   */
  await queryInterface.removeColumn("users", "job_type_id");
};
