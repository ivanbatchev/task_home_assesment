import { cleanEnv, url } from "envalid";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});
dotenv.config();

export const env = cleanEnv(process.env, {
  SERVER_CHANGELOG_URL: url(),
});
