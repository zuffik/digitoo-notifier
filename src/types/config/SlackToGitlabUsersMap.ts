import { SlackConfig } from './SlackConfig';
import { GitlabConfig } from './GitlabConfig';

export type SlackToGitlabUsersMap = Record<SlackConfig['members'][0], GitlabConfig['members'][0]>;