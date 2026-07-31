import { JOB_TYPES } from "../../common/constants/job-types.js";

const handlers = new Map();

const registerHandler = (type, handler) => {
  handlers.set(type, handler);
};

const getHandler = (type) => {
  return handlers.get(type);
};

export { registerHandler, getHandler };
