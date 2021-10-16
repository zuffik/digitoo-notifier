import { Module } from '@nestjs/common';
import { GitlabModule } from './gitlab/gitlab.module';
import { SlackModule } from './slack/slack.module';
import { StorageModule } from './storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { IntegrationModule } from './integration/integration.module';
import { JiraModule } from './jira/jira.module';
import config from './config';

@Module({
  imports: [
    GitlabModule,
    SlackModule,
    StorageModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [config],
    }),
    IntegrationModule,
    JiraModule,
  ],
})
export class AppModule {}
