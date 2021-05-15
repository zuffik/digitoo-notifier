import { Module } from '@nestjs/common';
import { MessageBuilderService } from './message-builder/message-builder.service';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from '../slack/slack.module';
import { GitlabModule } from '../gitlab/gitlab.module';
import { WebhooksController } from './webhooks/webhooks.controller';

@Module({
  providers: [MessageBuilderService],
  imports: [ConfigModule, SlackModule, GitlabModule],
  controllers: [WebhooksController]
})
export class IntegrationModule {}
