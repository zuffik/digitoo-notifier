import { SlackToGitlabUsersMap } from './SlackToGitlabUsersMap';
import { GitlabToSlackUsersMap } from './GitlabToSlackUsersMap';

export interface AppConfig {
  port: number;
  slackToGitlab: SlackToGitlabUsersMap;
  gitlabToSlack: GitlabToSlackUsersMap;
}
