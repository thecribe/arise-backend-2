import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hash = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const compare = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const passwordService = {
  hash,
  compare,
};
