import { Module } from '@nestjs/common';
import { GitlabHooksController } from './gitlab-hooks/gitlab-hooks.controller';
import { ConfigService } from './config/config.service';
import { GitlabConnectorService } from './gitlab-connector/gitlab-connector.service';
import { HookIdentifierService } from './hook-identifier/hook-identifier.service';
import { HookValidatorService } from './hook-validator/hook-validator.service';
import { MessageBuilderService } from './message-builder/message-builder.service';
import { RuntimeStorageService } from './runtime-storage/runtime-storage.service';
import { SlackConnectorService } from './slack-connector/slack-connector.service';

@Module({
  imports: [],
  controllers: [GitlabHooksController],
  providers: [
    ConfigService,
    GitlabConnectorService,
    HookIdentifierService,
    HookValidatorService,
    MessageBuilderService,
    RuntimeStorageService,
    SlackConnectorService,
  ],
})
export class AppModule {}
