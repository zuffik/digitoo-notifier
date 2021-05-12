import { GitlabConfig } from './GitlabConfig';
import { SlackConfig } from './SlackConfig';

export type GitlabToSlackUsersMap = Record<GitlabConfig['members'][0], SlackConfig['members'][0]>;