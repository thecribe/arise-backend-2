import { Op } from "sequelize";
import { User, Role, UserRole, Token } from "../../database/models/index.js";

const findUserById = async (id) => {
  return User.findByPk(id);
};

const createUser = async (payload, transaction) => {
  return User.create(payload, { transaction });
};

const findRoleByName = async (name) => {
  return Role.findOne({
    where: { name },
  });
};

const assignRole = async (payload, transaction) => {
  return UserRole.create(payload, { transaction });
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
    include: [
      {
        model: Role,
        as: "roles",
        through: {
          attributes: [],
        },
      },
    ],
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
//Export all respository
export const authRepository = {
  findUserByEmail,
  findUserById,
  createUser,
  findRoleByName,
  assignRole,
  createToken,
  findToken,
  markTokenAsUsed,
  verifyUserEmail,
  updatePassword,
  createSession,
  updateSession,
  findSession,
};
