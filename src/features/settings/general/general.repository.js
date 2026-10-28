import { GeneralSettings } from "../../../database/models/GeneralSettings.js";

const findFirst = async (options = {}) => {
  return GeneralSettings.findOne({
    order: [["created_at", "ASC"]],
    ...options,
  });
};

const create = async (data, options = {}) => {
  return GeneralSettings.create(data, options);
};

const update = async (settings, data, options = {}) => {
  return settings.update(data, options);
};

export const generalSettingsRepository = {
  findFirst,
  create,
  update,
};
