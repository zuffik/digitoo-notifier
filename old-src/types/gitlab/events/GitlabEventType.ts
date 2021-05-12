import { MergeRequestEvent } from './MergeRequestEvent';
import { CommentEvent } from './CommentEvent';
import { PipelineEvent } from './PipelineEvent';

export type GitlabEventType =
  | 'Note Hook'
  | 'Merge Request Hook'
  | 'Pipeline Hook';

export const gitlabEventTypes: GitlabEventType[] = [
  'Note Hook',
  'Merge Request Hook',
  'Pipeline Hook',
];
export const isGitlabEventType = (
  eventType: string
): eventType is GitlabEventType => gitlabEventTypes.includes(eventType as any);

export type EventBody = MergeRequestEvent | CommentEvent | PipelineEvent;

export const isMergeRequestEventBody = (
  body: EventBody
): body is MergeRequestEvent => body.object_kind === 'merge_request';
export const isCommentEventBody = (body: EventBody): body is CommentEvent =>
  body.object_kind === 'note';
export const isPipelineEventBody = (body: EventBody): body is PipelineEvent =>
  body.object_kind === 'pipeline';
