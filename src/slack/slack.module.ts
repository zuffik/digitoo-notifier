import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SlackService],
  exports: [SlackService],
  imports: [ConfigModule],
})
export class SlackModule {}
