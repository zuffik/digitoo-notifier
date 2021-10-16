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
      sourceBranchesBlacklist: ['test', 'preprod', 'prod'],
      targetBranchesWhitelist: ['master', 'test', 'preprod', 'prod'],
      reportPipelinesBranches: ['master', 'test', 'preprod', 'prod'],
    },
    slack: {
      appName: 'Digitoo Bot',
      token: env.SLACK_TOKEN,
      channel: env.SLACK_CHANNEL,
      members: ['U01DJACKEKW', 'U01RENUTSQ5'],
    },
    jira: {
      taskDomain: 'digitoo.atlassian.net',
      taskPrefix: 'DIG',
      email: 'kristian.zuffa@digitoo.cz',
      apiToken: env.JIRA_API_TOKEN,
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
