export interface Env extends NodeJS.ProcessEnv {
  GITLAB_ACCESS_TOKEN?: string;
  SLACK_WEBHOOK_URL?: string;
  PORT?: string;
}
