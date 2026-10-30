/**
 * -----------------------------------------------------------------------------
 * File: user.service.js
 *
 * Description:
 * Handles Settings user management, including account creation, user updates,
 * role assignment, and account activation/deactivation.
 *
 * Applicants and carers cannot be managed through this service.
 * User changes and audit records are managed transactionally.
 * -----------------------------------------------------------------------------
 */

import { AUDIT_ACTIONS } from "../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../common/constants/audit-entity-types.js";

import { ConflictError } from "../../../common/errors/conflict-error.js";
import { NotFoundError } from "../../../common/errors/not-found-error.js";
import { passwordService } from "../../../common/services/password.service.js";

import { sequelize } from "../../../config/database.js";
import { JobType } from "../../../database/models/JobType.js";
import { Role } from "../../../database/models/Role.js";
import { User } from "../../../database/models/User.js";

import { recordAuditAction } from "../../audit/record-audit-action.js";
import {
  findAll,
  findAnyByEmail,
  findAssignableRoleById,
  findAssignableRoles,
  findById,
} from "./user.repository.js";

const EXCLUDED_ROLES = ["APPLICANT", "CARER"];

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

const getUserSnapshot = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phoneNumber: user.phone_number,
    address: user.address,
    postcode: user.postcode,
    roleId: user.role_id,
    roleName: user.role?.name ?? null,
    jobTypeId: user.job_type_id,
    isActive: user.is_active,
    isEmailVerified: user.is_email_verified,
  };
};

const assertManageableRole = (role) => {
  if (!role) {
    throw new NotFoundError("Role not found.");
  }

  if (EXCLUDED_ROLES.includes(role.name)) {
    throw new ConflictError(
      "Applicants and carers cannot be managed through Settings.",
    );
  }
};

const getUserOrThrow = async (userId, transaction) => {
  const user = await findById(userId, {
    transaction,
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return user;
};

const getAssignableRoleOrThrow = async (roleId, transaction) => {
  const role = await findAssignableRoleById(roleId, {
    transaction,
  });

  if (!role) {
    throw new NotFoundError(
      "The selected role does not exist or cannot be assigned through Settings.",
    );
  }

  assertManageableRole(role);

  return role;
};

/**
 * Use the existing repository email lookup across ALL users.
 * Email addresses must remain unique across applicants, carers,
 * staff, managers, and administrators.
 */
const assertEmailAvailable = async (email, excludeUserId, transaction) => {
  const existingUser = await findAnyByEmail(email, {
    excludeId: excludeUserId,
    transaction,
  });

  if (existingUser) {
    throw new ConflictError("A user with this email address already exists.");
  }
};

const assertAuditActionsExist = (actions) => {
  for (const action of actions) {
    if (!action) {
      throw new Error(
        "A required user-management audit action is missing from AUDIT_ACTIONS.",
      );
    }
  }
};

/**
 * -----------------------------------------------------------------------------
 * Get all manageable users.
 * -----------------------------------------------------------------------------
 */

const getAllUsers = async (filters = {}) => {
  return findAll(filters);
};

/**
 * -----------------------------------------------------------------------------
 * Get a manageable user by ID.
 * -----------------------------------------------------------------------------
 */

const getUserById = async (userId) => {
  return getUserOrThrow(userId);
};

/**
 * -----------------------------------------------------------------------------
 * Create a user and record the audit event transactionally.
 *
 * Expected input:
 * {
 *   first_name,
 *   last_name,
 *   email,
 *   phone_number,
 *   address,
 *   postcode,
 *   role_id,
 *   job_type_id,
 *   password,
 *   actorId,
 *   auditContext
 * }
 *
 * Password hashing should be performed by the established authentication
 * password utility before persisting the password.
 * -----------------------------------------------------------------------------
 */

const createUser = async ({
  first_name,
  last_name,
  email,
  phone_number,
  address,
  postcode,
  role_id,
  job_type_id,
  password,
  actorId,
  auditContext,
}) => {
  assertAuditActionsExist([AUDIT_ACTIONS.USER_CREATED]);

  return sequelize.transaction(async (transaction) => {
    await assertEmailAvailable(email, undefined, transaction);

    await getAssignableRoleOrThrow(role_id, transaction);

    // Use the supplied job type, or fall back to the configured default.
    let resolvedJobTypeId = job_type_id ? job_type_id : null;

    if (!resolvedJobTypeId) {
      const defaultJobType = await JobType.findOne({
        where: {
          is_default: true,
        },
        attributes: ["id"],
        transaction,
      });

      if (!defaultJobType) {
        throw new ConflictError(
          "No default job type is configured. Please configure a default job type before creating users.",
        );
      }

      resolvedJobTypeId = defaultJobType.id;
    }

    const hashedPassword = await passwordService.hash(password);

    const createdUser = await User.create(
      {
        first_name,
        last_name,
        email: email.trim(),
        phone_number,
        address: address ?? null,
        postcode,
        role_id,
        job_type_id: resolvedJobTypeId,
        password: hashedPassword,
      },
      { transaction },
    );

    const user = await findById(createdUser.id, { transaction });

    if (!user) {
      throw new ConflictError("Created user could not be retrieved.");
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_CREATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: user.id,
      previousData: null,
      newData: getUserSnapshot(user),
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return user;
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update manageable user details.
 * -----------------------------------------------------------------------------
 */

const updateUser = async ({
  userId,
  first_name,
  last_name,
  email,
  phone_number,
  address,
  postcode,
  job_type_id,
  actorId,
  auditContext,
}) => {
  assertAuditActionsExist([AUDIT_ACTIONS.USER_UPDATED]);

  return sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const manageableUser = await findById(userId, {
      transaction,
    });

    if (!manageableUser) {
      throw new NotFoundError("User not found.");
    }

    if (email && email.trim() !== user.email) {
      await assertEmailAvailable(email, userId, transaction);
    }

    const before = getUserSnapshot(manageableUser);

    await user.update(
      {
        first_name,
        last_name,
        email: email?.trim() ?? user.email,
        phone_number,
        address: address ?? null,
        postcode,
        job_type_id,
      },
      { transaction },
    );

    const updatedUser = await findById(userId, { transaction });

    if (!updatedUser) {
      throw new ConflictError("Updated user could not be retrieved.");
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: updatedUser.id,
      previousData: before,
      newData: getUserSnapshot(updatedUser),
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return updatedUser;
  });
};

/**
 * -----------------------------------------------------------------------------
 * Assign a new role to a manageable user.
 * -----------------------------------------------------------------------------
 */

const updateUserRole = async ({ userId, roleId, actorId, auditContext }) => {
  assertAuditActionsExist([AUDIT_ACTIONS.USER_ROLE_UPDATED]);

  return sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const currentUser = await findById(userId, { transaction });

    if (!currentUser) {
      throw new NotFoundError("User not found.");
    }

    const role = await getAssignableRoleOrThrow(roleId, transaction);

    if (currentUser.role_id === role.id) {
      throw new ConflictError("The user already has this role.");
    }

    const before = getUserSnapshot(currentUser);

    await user.update({ role_id: role.id }, { transaction });

    const updatedUser = await findById(userId, { transaction });

    if (!updatedUser) {
      throw new ConflictError("Updated user could not be retrieved.");
    }

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_ROLE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: updatedUser.id,
      previousData: before,
      newData: getUserSnapshot(updatedUser),
      metadata: {
        actorId,
        previousRoleId: before.roleId,
        newRoleId: role.id,
      },
      options: {
        transaction,
      },
    });

    return updatedUser;
  });
};

/**
 * -----------------------------------------------------------------------------
 * Activate or deactivate a manageable user.
 * -----------------------------------------------------------------------------
 */

const updateUserStatus = async ({
  userId,
  isActive,
  actorId,
  auditContext,
}) => {
  if (typeof isActive !== "boolean") {
    throw new ConflictError("Account status must be a boolean value.");
  }

  const action = isActive
    ? AUDIT_ACTIONS.USER_ACTIVATED
    : AUDIT_ACTIONS.USER_DEACTIVATED;

  assertAuditActionsExist([action]);

  return sequelize.transaction(async (transaction) => {
    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const currentUser = await findById(userId, { transaction });

    if (!currentUser) {
      throw new NotFoundError("User not found.");
    }

    if (user.is_active === isActive) {
      throw new ConflictError(
        `The user account is already ${isActive ? "active" : "inactive"}.`,
      );
    }

    const before = getUserSnapshot(currentUser);

    await user.update({ is_active: isActive }, { transaction });

    const updatedUser = await findById(userId, { transaction });

    if (!updatedUser) {
      throw new ConflictError("Updated user could not be retrieved.");
    }

    await recordAuditAction({
      auditContext,
      action,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: updatedUser.id,
      previousData: before,
      newData: getUserSnapshot(updatedUser),
      metadata: {
        actorId,
      },
      options: {
        transaction,
      },
    });

    return updatedUser;
  });
};

/**
 * -----------------------------------------------------------------------------
 * List roles available for assignment.
 * -----------------------------------------------------------------------------
 */

const getAssignableRoles = async () => {
  return findAssignableRoles();
};

const resetUserPassword = async ({ userId, newPassword, auditContext }) => {
  return sequelize.transaction(async (transaction) => {
    assertAuditActionsExist([AUDIT_ACTIONS.USER_PASSWORD_UPDATED]);

    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    // Capture a safe snapshot before changing the password.
    const previousData = getUserSnapshot(user);

    const hashedPassword = await passwordService.hash(newPassword);

    await user.update({ password: hashedPassword }, { transaction });

    const revokedSessions = await userRepository.revokeAllUserSessions(
      userId,
      transaction,
    );

    const updatedUser = await userRepository.findById(userId, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.USER_PASSWORD_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.USER,
      entityId: userId,
      previousData,
      newData: {
        ...getUserSnapshot(updatedUser),
        passwordReset: true,
        sessionsRevoked: revokedSessions,
      },
      options: { transaction },
    });

    return updatedUser;
  });
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  getAssignableRoles,
  resetUserPassword,
};
