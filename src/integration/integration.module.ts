import { Module } from '@nestjs/common';
import { MessageBuilderService } from './message-builder/message-builder.service';
import { ConfigModule } from '@nestjs/config';
import { IntegrationService } from './integration.service';
import { SlackModule } from '../slack/slack.module';
import { GitlabModule } from '../gitlab/gitlab.module';
import { IntegrationController } from './integration.controller';

@Module({
  providers: [MessageBuilderService, IntegrationService],
  imports: [ConfigModule, SlackModule, GitlabModule],
  controllers: [IntegrationController]
})
export class IntegrationModule {}
