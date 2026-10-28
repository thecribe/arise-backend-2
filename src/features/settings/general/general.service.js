import { generalSettingsRepository } from "./general.repository.js";
import { sequelize } from "../../../config/database.js";
import { AUDIT_ACTIONS } from "../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../common/constants/audit-entity-types.js";
import { recordAuditAction } from "../../audit/record-audit-action.js";

const JSON_FIELDS = ["logo", "favicon"];

const ALLOWED_FIELDS = [
  "organisation_name",
  "site_name",
  "description",
  "website_url",
  "organisation_email",
  "recruitment_email",
  "telephone",
  "address",
  "country",
  "postcode",
  "logo",
  "favicon",
];

const serialiseJson = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  return JSON.stringify(value);
};

const parseJson = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new Error(
      `Unable to parse stored JSON for General Settings field "${fieldName}".`,
    );
  }
};

const toResponse = (settings) => {
  if (!settings) {
    return null;
  }

  const result = settings.toJSON();

  for (const field of JSON_FIELDS) {
    result[field] = parseJson(result[field], field);
  }

  return result;
};

const getGeneralSettings = async () => {
  const settings = await generalSettingsRepository.findFirst();

  return toResponse(settings);
};

const updateGeneralSettings = async (data, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const settings = await generalSettingsRepository.findFirst({
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const previousData = toResponse(settings);
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
      if (data[field] === undefined) {
        continue;
      }

      updates[field] = JSON_FIELDS.includes(field)
        ? serialiseJson(data[field])
        : data[field];
    }

    let savedSettings;

    if (!settings) {
      savedSettings = await generalSettingsRepository.create(updates, {
        transaction,
      });
    } else {
      savedSettings = await generalSettingsRepository.update(
        settings,
        updates,
        { transaction },
      );
    }

    const newData = toResponse(savedSettings);

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.GENERAL_SETTINGS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.GENERAL_SETTINGS,
      entityId: savedSettings.id,
      previousData,
      newData,
      metadata: {
        feature: "general-settings",
        operation: settings ? "update" : "create",
      },
      options: { transaction },
    });

    return newData;
  });
};

export const generalSettingsService = {
  getGeneralSettings,
  updateGeneralSettings,
};
