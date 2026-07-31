import { User } from "./models/User.js";
import { Role } from "./models/Role.js";
import { UserRole } from "./models/UserRole.js";
import { Token } from "./models/Token.js";
import { UserSession } from "./models/UserSession.js";

const registerAssociations = () => {
  /**
   * User <-> Role
   */
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "user_id",
    otherKey: "role_id",
    as: "roles",
  });

  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "role_id",
    otherKey: "user_id",
    as: "users",
  });

  /**
   * User -> Tokens
   */
  User.hasMany(Token, {
    foreignKey: "user_id",
    as: "tokens",
  });

  Token.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(UserSession, {
    foreignKey: "user_id",
    as: "sessions",
  });

  UserSession.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
};

export { registerAssociations };
