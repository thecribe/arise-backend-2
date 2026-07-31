import { v4 as uuid } from "uuid";

export const up = async ({ context: queryInterface }) => {
  const now = new Date();

  await queryInterface.bulkInsert("roles", [
    {
      id: uuid(),
      name: "TOP_ADMIN",
      description: "System administrator",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuid(),
      name: "RECRUITMENT_MANAGER",
      description: "Recruitment manager",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuid(),
      name: "COMPLIANCE_MANAGER",
      description: "Compliance manager",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuid(),
      name: "STAFF_MANAGER",
      description: "Staff manager",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuid(),
      name: "CARER",
      description: "Approved staff member",
      created_at: now,
      updated_at: now,
    },
    {
      id: uuid(),
      name: "APPLICANT",
      description: "New applicant",
      created_at: now,
      updated_at: now,
    },
  ]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete("roles", {
    name: [
      "TOP_ADMIN",
      "RECRUITMENT_MANAGER",
      "COMPLIANCE_MANAGER",
      "STAFF_MANAGER",
      "CARER",
      "APPLICANT",
    ],
  });
};
