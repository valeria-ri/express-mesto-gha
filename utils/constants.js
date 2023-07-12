const SALT_ROUNDS = 10;
const regex = /https?:\/\/(www\.)?[a-z0-9.-]+\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/;

module.exports = {
  SALT_ROUNDS,
  regex,
};
