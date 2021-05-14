import { Inject, Injectable } from '@nestjs/common';
import {
  AppConfig,
  CommentEvent,
  JiraConfig,
  LinkPart,
  MergeRequestAttributes,
  MergeRequestEvent,
  Setup
} from '../../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageBuilderService {
  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService<Setup>
  ) {
  }

  private parseProjectReference(data: MergeRequestAttributes): LinkPart[] {
    const jiraConfig = this.cfg.get<JiraConfig>('jira');
    const taskRegex = new RegExp(`${jiraConfig.taskPrefix}-\d+`);
    const match = taskRegex.exec(data.title);
    let title: LinkPart[] = [
      {
        label: data.title,
        url: data.url
      }
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
                url: jiraConfig.taskBaseUrl + match[0]
              },
              {
                label: part,
                url: data.url
              }
            ].filter(Boolean) as LinkPart[]),
        [] as LinkPart[]
      );
    }
    return title;
  }

  private renderLink = (p: LinkPart): string => `<${p.url}|${p.label}>`;
  private renderMention = (user: string): string => `<@${user}>`;
  private renderTitle = (parts: LinkPart[]): string =>
    parts.map(this.renderLink).join(' ');

  public buildMessageForCreatedMergeRequest(data: MergeRequestEvent): string {
    const { gitlabToSlack } = this.cfg.get<AppConfig>('app');
    let result = '';
    const title = this.parseProjectReference(data.object_attributes);
    const assignees = Object.entries(gitlabToSlack)
      .filter(([gitlabId]) => parseInt(gitlabId) !== data.user.id)
      .map(([, slackId]) => slackId);
    result += `Hey, ${assignees
      .map(this.renderMention)
      .join(', ')} here's *new MR ready for code review*: ${this.renderTitle(
      title
    )}\n`;
    result += data.object_attributes.description;
    return result;
  }

  public buildNotificationForCreatedMergeRequest(
    data: MergeRequestEvent
  ): string {
    return `New MR for CR: ${data.object_attributes.title}`;
  }

  public buildMessageForApprovedMergeRequest(data: MergeRequestEvent): string {
    const { gitlabToSlack } = this.cfg.get<AppConfig>('app');
    let result = '';
    const title = this.parseProjectReference(data.object_attributes);
    const creator = gitlabToSlack[data.object_attributes.author_id];
    result += `Hey, ${this.renderMention(creator)} your MR ${this.renderTitle(
      title
    )} has been *approved*`;
    return result;
  }

  public buildNotificationForApprovedMergeRequest(
    data: MergeRequestEvent
  ): string {
    return `MR ${data.object_attributes.title} was approved`;
  }

  public buildMessageForCodeReviewTitle(data: CommentEvent): string {
    const { gitlabToSlack } = this.cfg.get<AppConfig>('app');
    const title = this.parseProjectReference(data.merge_request);
    return `Hey, ${this.renderMention(
      gitlabToSlack[data.merge_request.author_id]
    )}, your merge request ${this.renderTitle(title)} has been *commented on*:`;
  }

  public buildNotificationForCodeReviewTitle(data: CommentEvent): string {
    return `Comment on ${data.merge_request.title}`;
  }

  public buildMessageForCodeReviewMessage(data: CommentEvent): string {
    return `${this.renderLink({
      label: `${data.object_attributes.position.new_path}:${data.object_attributes.position.new_line}`,
      url: data.object_attributes.url
    })}\n${data.object_attributes.note}`;
  }

  public buildNotificationForCodeReviewMessage(data: CommentEvent): string {
    return data.object_attributes.note;
  }
}
