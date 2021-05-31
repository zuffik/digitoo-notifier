import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MessageBuilderService } from './message-builder/message-builder.service';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from '../slack/slack.module';
import { GitlabModule } from '../gitlab/gitlab.module';
import { WebhooksController } from './webhooks/webhooks.controller';
import { GitlabDispatcherMiddleware } from '../gitlab/gitlab-dispatcher.middleware';
import { GitlabController } from './gitlab/gitlab.controller';
import { IntegrationStorageService } from './integration-storage/integration-storage.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  providers: [MessageBuilderService, IntegrationStorageService],
  imports: [StorageModule, ConfigModule, SlackModule, GitlabModule],
  controllers: [WebhooksController, GitlabController],
})
export class IntegrationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(GitlabDispatcherMiddleware)
      .forRoutes({ path: '/webhooks/gitlab', method: RequestMethod.POST });
  }
}
