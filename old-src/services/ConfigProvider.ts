import setupJson from "../../setup.json";
import { Env, Setup } from "../types/config";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

const envSuffixes = ["", ".local"];

export const env: Env = envSuffixes.reduce((result, suffix) => {
  const envFile = path.join(process.cwd(), ".env" + suffix);
  if (fs.existsSync(envFile)) {
    const parsed = config({
      path: envFile
    });
    if (!parsed.error) {
      return {
        ...result,
        ...parsed.parsed
      };
    }
  }
  return result;
}, process.env);

const processString = (value: string) =>
  Object.keys(env).reduce(
    (result, key) =>
      result.replace(new RegExp(`{${key}}`, "g"), (env as any)[key]),
    value
  );
const processValue = (value: any): any =>
  Array.isArray(value)
    ? value.map(processValue)
    : typeof value === "object"
    ? processObject(value)
    : typeof value === "string"
      ? processString(value)
      : value;
const processObject = <T>(object: T): T =>
  Object.assign(
    {},
    ...Object.entries(object).map(([key, value]) => ({
      [key]: processValue(value)
    }))
  );
const processJsonInput = (json: typeof setupJson): Setup => {
  const setup = processObject(json) as Setup;
  setup.app.gitlabToSlack = setup.app.gitlabToSlack || {};
  setup.app.slackToGitlab = setup.app.slackToGitlab || {};
  setup.slack.members.forEach((m, i) => {
    const slackMember = setup.slack.members[i];
    const gitlabMember = setup.gitlab.members[i];
    setup.app.gitlabToSlack[gitlabMember] = slackMember;
    setup.app.slackToGitlab[slackMember] = gitlabMember;
  })
  return setup;
};

export const setup: Setup = processJsonInput(setupJson);
