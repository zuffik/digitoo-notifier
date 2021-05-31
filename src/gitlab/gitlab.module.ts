import { Module } from '@nestjs/common';
import { GitlabHooksService } from './gitlab-hooks/gitlab-hooks.service';
import { StorageModule } from '../storage/storage.module';
import { GitlabConnectorService } from './gitlab-connector/gitlab-connector.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [GitlabHooksService, GitlabConnectorService],
  exports: [GitlabHooksService, GitlabConnectorService],
  imports: [StorageModule, ConfigModule],
  controllers: [],
})
export class GitlabModule {}
