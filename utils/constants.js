const SALT_ROUNDS = 10;
const SECRET_KEY = 'very-very-secret-key';
const regex = /https?:\/\/(www\.)?[a-z0-9.-]+\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/;

module.exports = {
  SALT_ROUNDS,
  SECRET_KEY,
  regex,
};
