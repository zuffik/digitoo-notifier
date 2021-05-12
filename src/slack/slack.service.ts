import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlackConfig } from '../types';
import { IncomingWebhook } from '@slack/webhook';

@Injectable()
export class SlackService {
  private webhook: IncomingWebhook;

  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService
  ) {
    this.webhook = new IncomingWebhook(
      this.cfg.get<SlackConfig>('slack').webhookUrl
    );
  }

  public send(message: string, notificationText?: string) {
    return this.webhook.send({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        }
      ],
      text: notificationText
    });
  }
}
