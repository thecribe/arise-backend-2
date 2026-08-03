import crypto from "crypto";

const generate = (size = 64) => {
  return crypto.randomBytes(size).toString("hex");
};

const hash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const compare = (token, hashedToken) => {
  return hash(token) === hashedToken;
};

export const tokenService = {
  generate,
  hash,
  compare,
};
