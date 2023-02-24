const { cleanEnv, num, url } = require("envalid");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env.local",
});
dotenv.config();

const env = cleanEnv(process.env, {
  SERVER_CHANGELOG_URL: url(),
  SERVER_PORT: num(),
});

module.exports = {
  env,
};
