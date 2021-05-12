import { Request, Response } from 'express';
import {
  ConfigProvider,
  GitlabConnector,
  HookIdentifier,
  HookValidator,
  MessageBuilder,
  RuntimeStorage,
  SlackConnector
} from '../services';
import { CommentEvent, MergeRequestEvent, PipelineEvent } from '../types';

export const mergeRequest = async (data: MergeRequestEvent) => {
  if (!HookValidator.isFrontendRelatedHook(data, ConfigProvider.setup.gitlab))
    return;
  console.log(JSON.stringify(data));
  if (HookIdentifier.isMergeRequestCreateEvent(data)) {
    await GitlabConnector.assignLabelToMergeRequest(
      data.project.id,
      data.object_attributes.iid,
      ConfigProvider.setup.gitlab.labels
    );
    if (!data.object_attributes.work_in_progress) {
      await SlackConnector.sendMessage(
        MessageBuilder.mergeRequestCreated({
          data,
          jira: ConfigProvider.setup.jira,
          gitlabToSlackUserMap: ConfigProvider.setup.app.gitlabToSlack
        })
      );
    }
  }
  if (
    HookIdentifier.isMergeRequestMarkAsReadyEvent(data) &&
    !data.object_attributes.work_in_progress
  ) {
    await SlackConnector.sendMessage(
      MessageBuilder.mergeRequestCreated({
        data,
        jira: ConfigProvider.setup.jira,
        gitlabToSlackUserMap: ConfigProvider.setup.app.gitlabToSlack
      })
    );
  }
  if (HookIdentifier.isMergeRequestApproveEvent(data)) {
    await SlackConnector.sendMessage(
      MessageBuilder.mergeRequestApproved({
        data,
        jira: ConfigProvider.setup.jira,
        gitlabToSlackUserMap: ConfigProvider.setup.app.gitlabToSlack
      })
    );
  }
};
export const comment = async (data: CommentEvent) => {
  if (
    !HookValidator.isFrontendRelatedHook(data, ConfigProvider.setup.gitlab) ||
    !HookValidator.isCommentHookCodeReview(data)
  ) {
    return;
  }
  if (
    !RuntimeStorage.codeReviewExists(
      data.merge_request.id,
      data.object_attributes.created_at
    )
  ) {
    RuntimeStorage.addCodeReview(
      data.merge_request.id,
      data.object_attributes.created_at
    );
    await SlackConnector.sendMessage(
      MessageBuilder.mergeRequestReviewTitle({
        data,
        jira: ConfigProvider.setup.jira,
        gitlabToSlackUserMap: ConfigProvider.setup.app.gitlabToSlack
      })
    );
  }
  await SlackConnector.sendMessage(
    MessageBuilder.mergeRequestReviewComment({
      data
    })
  );
};
export const pipeline = async (data: PipelineEvent) => {
  if (!HookValidator.isFrontendRelatedHook(data, ConfigProvider.setup.gitlab))
    return;
  console.log('pipeline');
  console.log(JSON.stringify(data));
};

export const dispatch = async (req: Request, res: Response) => {
  const gitlabEvent = req.header('X-Gitlab-Event');
  if (!gitlabEvent) {
    res.status(400);
    res.send('Empty action');
    return;
  }
  try {
    if (HookIdentifier.isMergeRequestHook(gitlabEvent)) {
      await mergeRequest(req.body as MergeRequestEvent);
    } else if (HookIdentifier.isNoteHook(gitlabEvent)) {
      await comment(req.body as CommentEvent);
    } else if (HookIdentifier.isPipelineHook(gitlabEvent)) {
      await pipeline(req.body as PipelineEvent);
    } else {
      res.status(400);
      res.send(`No such action ${gitlabEvent}`);
      return;
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
  res.sendStatus(200);
};
