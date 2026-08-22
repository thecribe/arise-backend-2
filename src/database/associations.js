import {
  JobType,
  Permission,
  Role,
  RolePermission,
  Token,
  User,
  UserSession,
  ApplicantApplication,
  ApplicantApplicationPhase,
  ApplicantApplicationSection,
  ApplicantApplicationSectionValue,
  ApplicationStatusHistory,
  ApplicationSectionReviewComment,
} from "./models/index.js";

const registerAssociations = () => {
  /**
   * User <-> Role
   */
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
  });

  Role.hasMany(User, {
    foreignKey: "role_id",
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
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "role_id",
    otherKey: "permission_id",
    as: "permissions",
  });

  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permission_id",
    otherKey: "role_id",
    as: "roles",
  });
  User.belongsTo(JobType, {
    foreignKey: "job_type_id",
    as: "jobType",
  });

  JobType.hasMany(User, {
    foreignKey: "job_type_id",
    as: "users",
  });

  User.hasOne(ApplicantApplication, {
    foreignKey: "applicant_id",
    as: "application",
  });

  ApplicantApplication.belongsTo(User, {
    foreignKey: "applicant_id",
    as: "applicant",
  });

  ApplicantApplication.hasMany(ApplicantApplicationPhase, {
    foreignKey: "application_id",
    as: "phases",
  });

  ApplicantApplicationPhase.belongsTo(ApplicantApplication, {
    foreignKey: "application_id",
    as: "application",
  });

  ApplicantApplication.hasMany(ApplicantApplicationSection, {
    foreignKey: "application_id",
    as: "sections",
  });

  ApplicantApplicationSection.belongsTo(ApplicantApplication, {
    foreignKey: "application_id",
    as: "application",
  });

  ApplicantApplication.hasMany(ApplicantApplicationSectionValue, {
    foreignKey: "application_id",
    as: "sectionValues",
  });

  ApplicantApplicationSectionValue.belongsTo(ApplicantApplication, {
    foreignKey: "application_id",
    as: "application",
  });

  ApplicantApplication.hasMany(ApplicationStatusHistory, {
    foreignKey: "application_id",
    as: "statusHistory",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  ApplicationStatusHistory.belongsTo(ApplicantApplication, {
    foreignKey: "application_id",
    as: "application",
  });
};
ApplicantApplication.hasMany(ApplicationSectionReviewComment, {
  foreignKey: "application_id",
  as: "sectionReviewComments",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ApplicationSectionReviewComment.belongsTo(ApplicantApplication, {
  foreignKey: "application_id",
  as: "application",
});

ApplicationSectionReviewComment.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

User.hasMany(ApplicationSectionReviewComment, {
  foreignKey: "created_by",
  as: "applicationSectionReviewComments",
});

export { registerAssociations };
