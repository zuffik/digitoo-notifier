import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GitlabHooksService } from '../../gitlab/gitlab-hooks/gitlab-hooks.service';
import { SlackService } from '../../slack/slack.service';
import { GitlabConnectorService } from '../../gitlab/gitlab-connector/gitlab-connector.service';
import { MessageBuilderService } from '../message-builder/message-builder.service';
import { CommentEvent, MergeRequestEvent, PipelineEvent } from '../../types';
import { FrontendRelatedHookGuard } from '../../gitlab/frontend-related-hook.guard';
import { IntegrationStorageService } from '../integration-storage/integration-storage.service';

@Controller('gitlab')
@UseGuards(FrontendRelatedHookGuard)
export class GitlabController {
  constructor(
    @Inject(GitlabHooksService)
    private readonly hooks: GitlabHooksService,
    @Inject(SlackService)
    private readonly slack: SlackService,
    @Inject(GitlabConnectorService)
    private readonly gitlabConnector: GitlabConnectorService,
    @Inject(MessageBuilderService)
    private readonly messageBuilder: MessageBuilderService,
    @Inject(IntegrationStorageService)
    private readonly storage: IntegrationStorageService
  ) {}

  @Post('merge-request')
  @HttpCode(204)
  public async mergeRequest(@Body() data: MergeRequestEvent) {
    if (
      !this.hooks.isMergeRequestToAllowedBranch(
        data.object_attributes.target_branch
      )
    )
      return;
    if (this.hooks.isMergeRequestCreateEvent(data)) {
      await this.gitlabConnector.assignLabelToMergeRequest(
        data.project.id,
        data.object_attributes.iid
      );
      if (!data.object_attributes.work_in_progress) {
        const threadId = await this.slack.send({
          message: this.messageBuilder.buildMessageForCreatedMergeRequest(data),
          notificationText: this.messageBuilder.buildNotificationForCreatedMergeRequest(
            data
          ),
        });
        this.storage.createThreadForMergeRequest(
          data.object_attributes.iid,
          threadId
        );
      }
    }
    if (
      this.hooks.isMergeRequestMarkAsReadyEvent(data) &&
      !data.object_attributes.work_in_progress
    ) {
      const threadId = await this.slack.send({
        message: this.messageBuilder.buildMessageForCreatedMergeRequest(data),
        notificationText: this.messageBuilder.buildNotificationForCreatedMergeRequest(
          data
        ),
      });
      this.storage.createThreadForMergeRequest(
        data.object_attributes.iid,
        threadId
      );
    }
    if (this.hooks.isMergeRequestApproveEvent(data)) {
      await this.slack.send({
        message: this.messageBuilder.buildMessageForApprovedMergeRequest(data),
        notificationText: this.messageBuilder.buildNotificationForApprovedMergeRequest(
          data
        ),
        threadId: this.storage.getThreadForMergeRequest(
          data.object_attributes.iid
        ),
      });
    }
  }

  @Post('comment')
  @HttpCode(204)
  public async comment(@Body() data: CommentEvent) {
    if (!this.hooks.isCommentHookCodeReview(data)) {
      return;
    }
    await this.slack.send({
      message: this.messageBuilder.buildMessageForCodeReviewMessage(data),
      notificationText: this.messageBuilder.buildNotificationForCodeReviewMessage(
        data
      ),
      threadId: this.storage.getThreadForMergeRequest(data.merge_request.iid),
    });
  }

  @Post('pipeline')
  @HttpCode(204)
  public async pipeline(@Body() data: PipelineEvent) {
    console.log('pipeline');
    console.log(JSON.stringify(data));
  }
}
