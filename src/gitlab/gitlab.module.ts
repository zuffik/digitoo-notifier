import { Module } from '@nestjs/common';
import { GitlabHooksService } from './gitlab-hooks/gitlab-hooks.service';
import { GitlabStorageService } from './gitlab-storage/gitlab-storage.service';
import { StorageModule } from '../storage/storage.module';
import { GitlabConnectorService } from './gitlab-connector/gitlab-connector.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [GitlabHooksService, GitlabStorageService, GitlabConnectorService],
  exports: [GitlabHooksService, GitlabStorageService, GitlabConnectorService],
  imports: [StorageModule, ConfigModule],
})
export class GitlabModule {}
