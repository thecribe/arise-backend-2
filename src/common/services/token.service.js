import crypto from "crypto";

const generate = (size = 64) => {
  return crypto.randomBytes(size).toString("hex");
};

const hash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const tokenService = {
  generate,
  hash,
};
