import { Inject, Injectable } from '@nestjs/common';
import {
  AppConfig,
  CommentEvent,
  JiraConfig,
  LinkPart,
  MergeRequestAttributes,
  MergeRequestEvent, PipelineEvent,
  Setup
} from "../../types";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageBuilderService {
  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService<Setup>
  ) {}

  public buildMessageForCreatedMergeRequest(data: MergeRequestEvent): string {
    const { gitlabToSlack } = this.cfg.get<AppConfig>('app');
    let result = '';
    const title = this.parseProjectReference(data.object_attributes);
    const creator = gitlabToSlack[data.object_attributes.author_id];
    result += `Hey, everybody <!here>: *new MR ready for code review* by ${this.renderMention(
      creator
    )} ${this.renderTitle(title)}\n`;
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

  public buildMessageForCodeReviewMessage(data: CommentEvent): string {
    const file = data.object_attributes.position
      ? this.renderLink({
          label: `${data.object_attributes.position.new_path}:${data.object_attributes.position.new_line}`,
          url: data.object_attributes.url,
        }) + '\n'
      : '';
    return `*Comment:*\n${file}${data.object_attributes.note}`;
  }

  public buildNotificationForCodeReviewMessage(data: CommentEvent): string {
    return data.object_attributes.note;
  }

  private parseProjectReference(data: MergeRequestAttributes): LinkPart[] {
    const jiraConfig = this.cfg.get<JiraConfig>('jira');
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
                  url: `https://${jiraConfig.taskDomain}/browse/${match[0]}`,
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

  private renderLink = (p: LinkPart): string => `<${p.url}|${p.label}>`;

  private renderMention = (user: string): string => `<@${user}>`;

  private renderTitle = (parts: LinkPart[]): string =>
    parts.map(this.renderLink).join(' ');

  public buildMessageForPipeline(data: PipelineEvent): string {
    return `*Pipeline* for branch \`${data.object_attributes.ref}\` has ${data.object_attributes.detailed_status}.`;
  }

  public buildNotificationForPipeline(data: PipelineEvent): string {
    return `Pipeline for branch ${data.object_attributes.ref} has ${data.object_attributes.detailed_status}.`;
  }
}
