import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommentEvent, MergeRequestEvent, PipelineEvent } from '../../types';
import { GitlabHooksService } from '../../gitlab/gitlab-hooks/gitlab-hooks.service';
import { FrontendRelatedHookGuard } from '../../gitlab/frontend-related-hook.guard';
import { SlackService } from '../../slack/slack.service';
import { GitlabConnectorService } from '../../gitlab/gitlab-connector/gitlab-connector.service';
import { MessageBuilderService } from '../message-builder/message-builder.service';
import { GitlabStorageService } from '../../gitlab/gitlab-storage/gitlab-storage.service';

@Controller('webhooks')
export class WebhooksController {
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
  ) {
  }

  private async mergeRequest(data: MergeRequestEvent) {
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

  private async comment(data: CommentEvent) {
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

  private async pipeline(data: PipelineEvent) {
    if (!this.hooks.isFrontendRelatedHook(data)) return;
    console.log('pipeline');
    console.log(JSON.stringify(data));
  }

  @Post('gitlab')
  @UseGuards(FrontendRelatedHookGuard)
  public async gitlab(
    @Req() req: Request,
    @Body() body: MergeRequestEvent | CommentEvent | PipelineEvent,
    @Res() res: Response
  ) {
    const gitlabEvent = req.header('X-Gitlab-Event');
    if (!gitlabEvent) {
      throw new BadRequestException('Not a gitlab event');
    }
    let hasProcessed = true;
    try {
      if (this.hooks.isMergeRequestHook(gitlabEvent)) {
        await this.mergeRequest(body as MergeRequestEvent);
      } else if (this.hooks.isNoteHook(gitlabEvent)) {
        await this.comment(body as CommentEvent);
      } else if (this.hooks.isPipelineHook(gitlabEvent)) {
        await this.pipeline(body as PipelineEvent);
      } else {
        hasProcessed = false;
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    if (!hasProcessed) {
      throw new BadRequestException(`No such action ${gitlabEvent}`);
    }
    res.sendStatus(204);
  }
}
