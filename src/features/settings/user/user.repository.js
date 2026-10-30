import { Op } from "sequelize";

import { Role } from "../../../database/models/Role.js";
import { User } from "../../../database/models/User.js";
import { UserSession } from "../../../database/models/UserSession.js";

const EXCLUDED_ROLES = ["APPLICANT", "CARER"];

/**
 * Shared include for manageable users.
 * Excludes APPLICANT and CARER roles.
 */
const roleInclude = {
  model: Role,
  as: "role",
  attributes: ["id", "name", "description", "is_system"],
  required: true,
  where: {
    name: {
      [Op.notIn]: EXCLUDED_ROLES,
    },
  },
};

/**
 * Build user query filters.
 */
const buildUserWhere = ({ search = "", roleId, isActive } = {}) => {
  const where = {};
  const searchTerm = String(search).trim();

  if (searchTerm) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${searchTerm}%` } },
      { last_name: { [Op.like]: `%${searchTerm}%` } },
      { email: { [Op.like]: `%${searchTerm}%` } },
      { phone_number: { [Op.like]: `%${searchTerm}%` } },
      { postcode: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  if (roleId) {
    where.role_id = roleId;
  }

  if (typeof isActive === "boolean") {
    where.is_active = isActive;
  }

  return where;
};

/**
 * Shared query options for a manageable user.
 */
const manageableUserOptions = (options = {}) => ({
  include: [roleInclude],
  attributes: {
    exclude: ["password"],
  },
  ...options,
});

/**
 * List users available in Settings > User Management.
 */
const findAll = async (
  { page = 1, limit = 10, search = "", roleId, isActive } = {},
  options = {},
) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  const offset = (safePage - 1) * safeLimit;

  const { rows, count } = await User.findAndCountAll({
    where: buildUserWhere({
      search,
      roleId,
      isActive,
    }),
    ...manageableUserOptions(),
    limit: safeLimit,
    offset,
    order: [
      ["created_at", "DESC"],
      ["id", "ASC"],
    ],
    distinct: true,
    ...options,
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(count / safeLimit),
    },
  };
};

/**
 * Find a manageable user by ID.
 * Returns null for missing users and excluded roles.
 */
const findById = async (id, options = {}) => {
  return User.findOne({
    where: { id },
    ...manageableUserOptions(),
    ...options,
  });
};

/**
 * Find a manageable user by email.
 */
const findByEmail = async (email, { excludeId, ...options } = {}) => {
  const where = {
    email: {
      [Op.eq]: String(email).trim(),
    },
  };

  if (excludeId) {
    where.id = {
      [Op.ne]: excludeId,
    };
  }

  return User.findOne({
    where,
    ...manageableUserOptions(),
    ...options,
  });
};

/**
 * Find any user by email, regardless of role.
 * Used for global email uniqueness checks.
 */
const findAnyByEmail = async (email, { excludeId, ...options } = {}) => {
  const where = {
    email: {
      [Op.eq]: String(email).trim(),
    },
  };

  if (excludeId) {
    where.id = {
      [Op.ne]: excludeId,
    };
  }

  return User.findOne({
    where,
    attributes: {
      exclude: ["password"],
    },
    ...options,
  });
};

/**
 * Create a user and retrieve the manageable user record
 * within the same transaction.
 */
const create = async (values, options = {}) => {
  const user = await User.create(values, options);

  return findById(user.id, options);
};

/**
 * Update a manageable user.
 */
const update = async (id, values, options = {}) => {
  const user = await findById(id, options);

  if (!user) {
    return null;
  }

  await user.update(values, options);

  return findById(id, options);
};

/**
 * Update a user's assigned role.
 */
const updateRole = async (id, roleId, options = {}) => {
  return update(id, { role_id: roleId }, options);
};

/**
 * Update a user's active status.
 */
const updateStatus = async (id, isActive, options = {}) => {
  return update(id, { is_active: isActive }, options);
};

/**
 * Find a role assignable through Settings.
 */
const findAssignableRoleById = async (roleId, options = {}) => {
  return Role.findOne({
    where: {
      id: roleId,
      name: {
        [Op.notIn]: EXCLUDED_ROLES,
      },
    },
    attributes: ["id", "name", "description", "is_system"],
    ...options,
  });
};

/**
 * List roles assignable through Settings.
 */
const findAssignableRoles = async (options = {}) => {
  return Role.findAll({
    where: {
      name: {
        [Op.notIn]: EXCLUDED_ROLES,
      },
    },
    attributes: ["id", "name", "description", "is_system"],
    order: [["name", "ASC"]],
    ...options,
  });
};

const revokeAllUserSessions = async (userId, transaction) => {
  const [affectedCount] = await UserSession.update(
    {
      revoked_at: new Date(),
      refresh_token_hash: null,
    },
    {
      where: {
        user_id: userId,
        revoked_at: null,
      },
      transaction,
    },
  );

  return affectedCount;
};

export {
  findAll,
  findById,
  findByEmail,
  findAnyByEmail,
  create,
  update,
  updateRole,
  updateStatus,
  findAssignableRoleById,
  findAssignableRoles,
  revokeAllUserSessions,
};
