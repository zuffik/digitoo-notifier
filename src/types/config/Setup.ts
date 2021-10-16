import { GitlabConfig } from './GitlabConfig';
import { SlackConfig } from './SlackConfig';
import { AppConfig } from './AppConfig';
import { JiraConfig } from './JiraConfig';

export interface Setup {
  app: AppConfig;
  gitlab: GitlabConfig;
  slack: SlackConfig;
  jira: JiraConfig;
}
