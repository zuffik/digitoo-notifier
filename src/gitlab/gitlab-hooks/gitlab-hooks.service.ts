import { Inject, Injectable } from '@nestjs/common';
import {
  CommentEvent,
  EventBody,
  GitlabConfig,
  GitlabEventType,
  gitlabEventTypes,
  MergeRequestAttributes,
  MergeRequestEvent,
  PipelineEvent,
  Setup,
} from '../../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitlabHooksService {
  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService<Setup>
  ) {}

  public isGitlabEventType = (
    eventType: string
  ): eventType is GitlabEventType =>
    gitlabEventTypes.includes(eventType as any);

  public isMergeRequestEventBody = (
    body: EventBody
  ): body is MergeRequestEvent => body.object_kind === 'merge_request';
  public isCommentEventBody = (body: EventBody): body is CommentEvent =>
    body.object_kind === 'note';
  public isPipelineEventBody = (body: EventBody): body is PipelineEvent =>
    body.object_kind === 'pipeline';

  public isNoteHook = (hook: string): hook is 'Note Hook' =>
    hook === 'Note Hook';
  public isMergeRequestHook = (hook: string): hook is 'Merge Request Hook' =>
    hook === 'Merge Request Hook';
  public isPipelineHook = (hook: string): hook is 'Pipeline Hook' =>
    hook === 'Pipeline Hook';

  public isMergeRequestCreateEvent = (data: MergeRequestEvent): boolean =>
    data.changes?.merge_status?.current === 'preparing' &&
    data.changes?.merge_status?.previous === 'unchecked';

  public isMergeRequestFromAllowedToAllowedBranch = (
    source: string,
    target: string
  ): boolean =>
    this.cfg
      .get<GitlabConfig>('gitlab')
      .targetBranchesWhitelist.some(branch => typeof branch === 'string' ? (target === branch) : branch.test(target)) &&
    !this.cfg
      .get<GitlabConfig>('gitlab')
      .sourceBranchesBlacklist.some(branch => typeof branch === 'string' ? (source === branch) : branch.test(source));

  public isReportingOnForPipelineBranch = (branch: string): boolean =>
    this.cfg
      .get<GitlabConfig>('gitlab')
      .reportPipelinesBranches.includes(branch);

  public isMergeRequestMarkAsReadyEvent = (data: MergeRequestEvent): boolean =>
    /^(wip|draft):/i.test(data.changes?.title?.previous || '') &&
    !/^(wip|draft):/i.test(data.changes?.title?.current || '');

  public isMergeRequestApproveEvent = (data: MergeRequestEvent): boolean =>
    data.object_attributes.action === 'approved';

  public isFrontendRelatedHook = (data: EventBody): boolean => {
    const relations = this.cfg.get<GitlabConfig>('gitlab');
    if (this.isMergeRequestEventBody(data)) {
      return Boolean(
        data.labels.findIndex((l) => relations.labels.includes(l.title)) >= 0 ||
          relations.members.includes(data.user.id) ||
          this.isMergeRequestRelatedToFrontend(
            data.object_attributes,
            relations.members
          )
      );
    } else if (this.isCommentEventBody(data)) {
      return Boolean(
        data.merge_request &&
          this.isMergeRequestRelatedToFrontend(
            data.merge_request,
            relations.members
          )
      );
    } else if (this.isPipelineEventBody(data)) {
      return Boolean(
        data.merge_request &&
          this.isMergeRequestRelatedToFrontend(
            data.merge_request,
            relations.members
          )
      );
    }
    return false;
  };

  public isCommentHookCodeReview = (data: CommentEvent): boolean =>
    data.merge_request.author_id !== data.object_attributes.author_id;

  private isMergeRequestRelatedToFrontend = (
    mr: MergeRequestAttributes,
    members: number[]
  ): boolean =>
    !!(
      (mr.assignee_ids && mr.assignee_ids.find((id) => members.includes(id))) ||
      members.includes(mr.assignee_id) ||
      members.includes(mr.author_id)
    );
}
