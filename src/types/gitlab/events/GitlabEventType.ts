import { MergeRequestEvent } from './MergeRequestEvent';
import { CommentEvent } from './CommentEvent';
import { PipelineEvent } from './PipelineEvent';

export const gitlabEventTypes: GitlabEventType[] = [
  'Note Hook',
  'Merge Request Hook',
  'Pipeline Hook',
];
export type EventBody = MergeRequestEvent | CommentEvent | PipelineEvent;

export interface EventTypes {
  'Note Hook': CommentEvent;
  'Merge Request Hook': MergeRequestEvent;
  'Pipeline Hook': PipelineEvent;
}

export type GitlabEventType = keyof EventTypes;
