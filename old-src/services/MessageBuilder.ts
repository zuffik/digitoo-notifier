import { CommentEvent, MergeRequestAttributes, MergeRequestEvent } from '../types';
import { JiraConfig } from '../types/config';
import { GitlabToSlackUsersMap } from '../types/config/GitlabToSlackUsersMap';

interface LinkPart {
  label: string;
  url: string;
}

interface ParseProjectReferenceOptions {
  jira: JiraConfig;
  attributes: MergeRequestAttributes;
}

const parseProjectReference = ({jira: jiraConfig, attributes: data}: ParseProjectReferenceOptions) => {
  const taskRegex = new RegExp(`${jiraConfig.taskPrefix}-\d+`);
  const match = taskRegex.exec(data.title);
  let title: LinkPart[] = [
    {
      label: data.title,
      url: data.url,
    },
  ];
  if (match) {
    const titleParts = data.title.split(match[0]);
    title = titleParts.reduce(
      (result, part, index) =>
        part.trim() === ''
          ? result
          : ([
            ...result,
            result.length > 0 && {
              label: match[0],
              url: jiraConfig.taskBaseUrl + match[0],
            },
            {
              label: part,
              url: data.url,
            },
          ].filter(Boolean) as LinkPart[]),
      [] as LinkPart[]
    );
  }
  return title;
}

const renderTitle = (parts: LinkPart[]): string => parts.map(renderLink).join(' ');

const renderLink = (p: LinkPart): string  => `<${p.url}|${p.label}>`
const renderMention = (user: string): string  => `<@${user}>`

interface MergeRequestCreatedOptions extends Omit<ParseProjectReferenceOptions, 'attributes'> {
  gitlabToSlackUserMap: GitlabToSlackUsersMap;

  data: MergeRequestEvent;
}

export const mergeRequestCreated = ({
  jira,
  data,
  gitlabToSlackUserMap,
}: MergeRequestCreatedOptions): string => {
  let result = '';
  const title = parseProjectReference({jira, attributes: data.object_attributes});
  const assignees = Object.entries(gitlabToSlackUserMap)
    .filter(([gitlabId]) => parseInt(gitlabId) !== data.user.id)
    .map(([, slackId]) => slackId);
  result += `Hey, ${assignees.map(renderMention).join(', ')} here's *new MR ready for code review*: ${renderTitle(title)}\n`;
  result += data.object_attributes.description;
  return result;
};

export const mergeRequestApproved = ({
  jira,
  data,
  gitlabToSlackUserMap,
}: MergeRequestCreatedOptions): string => {
  let result = '';
  const title = parseProjectReference({jira, attributes: data.object_attributes});
  const creator = gitlabToSlackUserMap[data.object_attributes.author_id];
  result += `Hey, ${renderMention(creator)} your MR ${renderTitle(title)} has been *approved*`;
  return result;
};

interface MergeRequestReviewTitleOptions extends Omit<ParseProjectReferenceOptions, 'attributes'> {
  gitlabToSlackUserMap: GitlabToSlackUsersMap;

  data: CommentEvent;
}

export const mergeRequestReviewTitle = ({data, gitlabToSlackUserMap, jira}: MergeRequestReviewTitleOptions): string => {
  const title = parseProjectReference({jira, attributes: data.merge_request});
  return `Hey, ${renderMention(gitlabToSlackUserMap[data.merge_request.author_id])}, your merge request ${renderTitle(title)} has been *commented on*:`;
}

interface MergeRequestReviewCommentOptions {
  data: CommentEvent;
}

export const mergeRequestReviewComment = ({data}: MergeRequestReviewCommentOptions) => {
  return `${renderLink({
    label: `${data.object_attributes.position.new_path}:${data.object_attributes.position.new_line}`,
    url: data.object_attributes.url
  })}\n${data.object_attributes.note}`
}
