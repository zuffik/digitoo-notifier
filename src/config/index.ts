import { Env, Setup } from '../types';
import { DeepPartial } from 'utility-types';

const env: Env = process.env;

export default (): Setup => {
  const setup: DeepPartial<Setup> = {
    app: {
      port: parseInt(env.PORT) || 6010,
    },
    gitlab: {
      accessToken: env.GITLAB_ACCESS_TOKEN,
      baseUrl: 'https://gitlab.com/api/v4',
      members: [1126129, 8427929],
      labels: ['frontend'],
    },
    slack: {
      webhookUrl: env.SLACK_WEBHOOK_URL,
      members: ['U01DJACKEKW', 'U01RENUTSQ5'],
    },
    jira: {
      taskBaseUrl: 'https://digitoo.atlassian.net/browse/',
      taskPrefix: 'DIG',
    },
  };
  setup.app.gitlabToSlack = setup.app.gitlabToSlack || {};
  setup.app.slackToGitlab = setup.app.slackToGitlab || {};
  setup.slack.members.forEach((m, i) => {
    const slackMember = setup.slack.members[i];
    const gitlabMember = setup.gitlab.members[i];
    setup.app.gitlabToSlack[gitlabMember] = slackMember;
    setup.app.slackToGitlab[slackMember] = gitlabMember;
  });
  return setup as Setup;
};
