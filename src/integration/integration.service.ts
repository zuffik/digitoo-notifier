import { Inject, Injectable } from '@nestjs/common';
import { CommentEvent, MergeRequestEvent, PipelineEvent } from '../types';
import { GitlabHooksService } from '../gitlab/gitlab-hooks/gitlab-hooks.service';
import { SlackService } from '../slack/slack.service';
import { GitlabConnectorService } from '../gitlab/gitlab-connector/gitlab-connector.service';
import { MessageBuilderService } from './message-builder/message-builder.service';
import { GitlabStorageService } from '../gitlab/gitlab-storage/gitlab-storage.service';

@Injectable()
export class IntegrationService {
  constructor(
    @Inject(GitlabHooksService)
    private readonly hooks: GitlabHooksService,
    @Inject(SlackService)
    private readonly slack: SlackService,
    @Inject(GitlabConnectorService)
    private readonly gitlabConnector: GitlabConnectorService,
    @Inject(MessageBuilderService)
    private readonly messageBuilder: MessageBuilderService,
    @Inject(GitlabStorageService)
    private readonly storage: GitlabStorageService
  ) {}

  public async mergeRequest(data: MergeRequestEvent) {
    if (!this.hooks.isFrontendRelatedHook(data)) return;
    console.log(JSON.stringify(data));
    if (this.hooks.isMergeRequestCreateEvent(data)) {
      await this.gitlabConnector.assignLabelToMergeRequest(
        data.project.id,
        data.object_attributes.iid
      );
      if (!data.object_attributes.work_in_progress) {
        await this.slack.send(
          this.messageBuilder.buildMessageForCreatedMergeRequest(data),
          this.messageBuilder.buildNotificationForCreatedMergeRequest(data)
        );
      }
    }
    if (
      this.hooks.isMergeRequestMarkAsReadyEvent(data) &&
      !data.object_attributes.work_in_progress
    ) {
      await this.slack.send(
        this.messageBuilder.buildMessageForCreatedMergeRequest(data),
        this.messageBuilder.buildNotificationForCreatedMergeRequest(data)
      );
    }
    if (this.hooks.isMergeRequestApproveEvent(data)) {
      await this.slack.send(
        this.messageBuilder.buildMessageForApprovedMergeRequest(data),
        this.messageBuilder.buildNotificationForApprovedMergeRequest(data)
      );
    }
  };

  public async comment(data: CommentEvent) {
    if (
      !this.hooks.isFrontendRelatedHook(data) ||
      !this.hooks.isCommentHookCodeReview(data)
    ) {
      return;
    }
    if (
      !this.storage.codeReviewExists(
        data.merge_request.id,
        data.object_attributes.created_at
      )
    ) {
      this.storage.addCodeReview(
        data.merge_request.id,
        data.object_attributes.created_at
      );
      await this.slack.send(
        this.messageBuilder.buildMessageForCodeReviewTitle(data),
        this.messageBuilder.buildNotificationForCodeReviewTitle(data)
      );
    }
    await this.slack.send(
      this.messageBuilder.buildMessageForCodeReviewMessage(data),
      this.messageBuilder.buildNotificationForCodeReviewMessage(data)
    );
  };

  public async pipeline(data: PipelineEvent) {
    if (!this.hooks.isFrontendRelatedHook(data)) return;
    console.log('pipeline');
    console.log(JSON.stringify(data));
  }
}
