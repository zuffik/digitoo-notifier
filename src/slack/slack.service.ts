import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ConfigService } from '@nestjs/config';
import { AppConfig, SlackConfig } from "../types";

type SendMessageOpts = {
  message: string;
  notificationText?: string;
  threadId?: string;
};

@Injectable()
export class SlackService {
  private readonly client: WebClient;
  private readonly channel: string;
  private readonly appName: string;

  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService
  ) {
    this.client = new WebClient(this.cfg.get<SlackConfig>('slack').token);
    this.channel = this.cfg.get<SlackConfig>('slack').channel;
    this.appName = this.cfg.get<SlackConfig>('slack').appName;
  }

  public async send({
    message,
    notificationText,
    threadId,
  }: SendMessageOpts): Promise<string> {
    const result = await this.client.chat.postMessage({
      channel: this.channel,
      username: this.appName,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
      ],
      text: notificationText,
      thread_ts: threadId,
    });
    return result.ts;
  }

  public creatorExistsInSlack(authorId: number) {
    const { gitlabToSlack } = this.cfg.get<AppConfig>('app');
    return !!gitlabToSlack[authorId];
  }
}
