import { Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [JiraService],
  exports: [JiraService],
  imports: [ConfigModule],
})
export class JiraModule {}
