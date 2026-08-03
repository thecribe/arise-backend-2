import { Op } from "sequelize";
import {
  User,
  Role,
  Token,
  Permission,
  UserSession,
  JobType,
} from "../../database/models/index.js";

const roleInclude = {
  model: Role,
  as: "role",

  include: [
    {
      model: Permission,
      as: "permissions",

      through: {
        attributes: [],
      },
    },
  ],
};
const jobTypeInclude = {
  model: JobType,
  as: "jobType",
};

const findUserById = async (id) => {
  return User.findByPk(id, {
    include: [roleInclude, jobTypeInclude],
  });
};

const createUser = async (payload, transaction) => {
  return User.create(payload, { transaction });
};

const findRoleByName = async (name) => {
  return Role.findOne({
    where: { name },
  });
};

const createToken = async (payload, transaction) => {
  return Token.create(payload, { transaction });
};

const findToken = async ({ tokenHash, type }) => {
  return Token.findOne({
    where: {
      token_hash: tokenHash,
      type,
      used_at: null,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },

    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
};
const markTokenAsUsed = async (token, transaction) => {
  return token.update(
    {
      used_at: new Date(),
    },
    {
      transaction,
    },
  );
};
const verifyUserEmail = async (user, transaction) => {
  return user.update(
    {
      is_email_verified: true,
      email_verified_at: new Date(),
    },
    {
      transaction,
    },
  );
};

const updatePassword = async (user, password, transaction) => {
  return user.update(
    {
      password,
    },
    {
      transaction,
    },
  );
};

//Login repositiory
const findUserByEmail = async (email) => {
  return User.findOne({
    where: {
      email,
    },

    include: [roleInclude, jobTypeInclude],
  });
};

const createSession = async (payload, transaction) => {
  return UserSession.create(payload, {
    transaction,
  });
};
const updateSession = async (session, payload, transaction) => {
  return session.update(payload, {
    transaction,
  });
};
const findSession = async (id) => {
  return UserSession.findOne({
    where: {
      id,
      revoked_at: null,
    },
  });
};
const updateLastLogin = async (user, transaction) => {
  return user.update(
    {
      last_login_at: new Date(),
    },
    {
      transaction,
    },
  );
};

const findAuthenticatedSession = async (sessionId) => {
  return UserSession.findOne({
    where: {
      id: sessionId,
      revoked_at: null,
    },

    include: [
      {
        model: User,
        as: "user",

        include: [roleInclude, jobTypeInclude],
      },
    ],
  });
};

/**
 * Revokes a single user session.
 */
const revokeSession = async (session, transaction) => {
  return session.update(
    {
      revoked_at: new Date(),
    },
    {
      transaction,
    },
  );
};

/**
 * Revokes every active session belonging to a user.
 */
const revokeAllSessions = async (userId, transaction) => {
  return UserSession.update(
    {
      revoked_at: new Date(),
    },
    {
      where: {
        user_id: userId,
        revoked_at: null,
      },
      transaction,
    },
  );
};
/**
 * Retrieves the default job type.
 */
const findDefaultJobType = async () => {
  return JobType.findOne({
    where: {
      is_default: true,
    },
  });
};

//Export all respository
export const authRepository = {
  findUserByEmail,
  findUserById,
  createUser,
  findRoleByName,

  createToken,
  findToken,
  markTokenAsUsed,
  verifyUserEmail,
  updatePassword,
  createSession,
  updateSession,
  findSession,
  updateLastLogin,
  findAuthenticatedSession,
  revokeSession,
  revokeAllSessions,
  findDefaultJobType,
};
