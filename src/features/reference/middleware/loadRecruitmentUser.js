import { NotFoundError } from "../../../common/errors/not-found-error.js";
import { sequelize } from "../../../config/database.js";
import { recruitmentRepository } from "../../recruitment/recruitment.repository.js";
import { referenceRepository } from "../reference.repository.js";

export const loadRecruitmentUser = async (req, res, next) => {
  try {
    const { applicationId, referenceId } = req.params;

    await sequelize.transaction(async (transaction) => {
      if (applicationId) {
        const application =
          await recruitmentRepository.findApplicantApplicationByApplicationId(
            applicationId,
            { transaction },
          );

        if (!application) {
          throw new NotFoundError("Application not found");
        }

        req.applicant = application.applicant;
        next();
      }

      if (referenceId) {
        const reference = await referenceRepository.findReferenceById(
          referenceId,
          { transaction },
        );

        if (!reference) {
          throw new NotFoundError("Reference not found");
        }

        const application =
          await recruitmentRepository.findApplicantApplicationByApplicationId(
            reference.applicationId,
            { transaction },
          );

        if (!application) {
          throw new NotFoundError("Application not found");
        }
        console.log(application);
        req.applicant = application.applicant;
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};
