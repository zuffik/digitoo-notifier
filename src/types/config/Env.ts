export interface Env extends NodeJS.ProcessEnv {
  GITLAB_ACCESS_TOKEN?: string;
  SLACK_TOKEN?: string;
  SLACK_CHANNEL?: string;
  PORT?: string;
}
