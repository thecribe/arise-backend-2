import { ApplicantApplication } from "../../database/models/ApplicantApplication.js";
import { ApplicationStatusHistory } from "../../database/models/ApplicationStatusHistory.js";
import { JobType } from "../../database/models/JobType.js";
import { Role } from "../../database/models/Role.js";
import { User } from "../../database/models/User.js";

/**
 * -----------------------------------------------------------------------------
 * User Queries
 * -----------------------------------------------------------------------------
 */

const findUserById = async (applicantId, options = {}) => {
  return User.findByPk(applicantId, {
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: Role,
        as: "role",
      },
      {
        model: JobType,
        as: "jobType",
      },
    ],
    ...options,
  });
};

const findUserByEmail = async (email, options = {}) => {
  return User.findOne({
    where: { email },
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: Role,
        as: "role",
      },
      {
        model: JobType,
        as: "jobType",
      },
    ],
    ...options,
  });
};

const findUserProfileById = async (applicantId, options = {}) => {
  return User.findByPk(applicantId, {
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: Role,
        as: "role",
      },
      {
        model: JobType,
        as: "jobType",
      },
    ],
    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * User Profile Updates
 * -----------------------------------------------------------------------------
 */

const updateUserProfile = async (applicantId, data, options = {}) => {
  return User.update(data, {
    where: { id: applicantId },
    ...options,
  });
};

const updateUserEmail = async (applicantId, email, options = {}) => {
  return User.update(
    { email, is_email_verified: false, email_verified_at: null },
    {
      where: { id: applicantId },
      ...options,
    },
  );
};

const updateUserPassword = async (applicantId, password, options = {}) => {
  return User.update(
    { password },
    {
      where: { id: applicantId },
      ...options,
    },
  );
};

const updateUserAccountStatus = async (applicantId, isActive, options = {}) => {
  return User.update(
    { is_active: isActive },
    {
      where: { id: applicantId },
      ...options,
    },
  );
};

/**
 * -----------------------------------------------------------------------------
 * Applicant Application Queries
 * -----------------------------------------------------------------------------
 */

const findApplicantApplicationById = async (applicationId, options = {}) => {
  return ApplicantApplication.findByPk(applicationId, {
    ...options,
  });
};

const findApplicantApplicationByApplicantId = async (
  applicantId,
  options = {},
) => {
  return ApplicantApplication.findOne({
    where: { applicant_id: applicantId },
    ...options,
  });
};

const findApplicantApplicationByIds = async (
  applicantId,
  applicationId,
  options = {},
) => {
  return ApplicantApplication.findOne({
    where: {
      //   id: applicationId,
      applicant_id: applicantId,
    },
    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Application State
 * -----------------------------------------------------------------------------
 */

const findApplicationStateByApplicationId = async (
  applicationId,
  options = {},
) => {
  return ApplicationStatusHistory.findOne({
    where: {
      application_id: applicationId,
    },
    ...options,
  });
};

const updateApplicationState = async (applicationId, data, options = {}) => {
  return ApplicationStatusHistory.update(data, {
    where: {
      application_id: applicationId,
    },
    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * User Role Queries
 * -----------------------------------------------------------------------------
 */

const findUserWithRoleById = async (applicantId, options = {}) => {
  return User.findByPk(applicantId, {
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
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
      },
    ],
    ...options,
  });
};

const findRoleById = async (roleId, options = {}) => {
  return Role.findByPk(roleId, {
    ...options,
  });
};

const updateUserRole = async (applicantId, roleId, options = {}) => {
  return User.update(
    { role_id: roleId },
    {
      where: { id: applicantId },
      ...options,
    },
  );
};

export {
  findUserById,
  findUserByEmail,
  findUserProfileById,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  updateUserAccountStatus,
  findApplicantApplicationById,
  findApplicantApplicationByApplicantId,
  findApplicantApplicationByIds,
  findApplicationStateByApplicationId,
  updateApplicationState,
  findUserWithRoleById,
  findRoleById,
  updateUserRole,
};
