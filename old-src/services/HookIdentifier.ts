import { CommentEvent, MergeRequestEvent, PipelineEvent } from '../types';

export const isNoteHook = (hook: string): hook is 'Note Hook' =>
  hook === 'Note Hook';
export const isMergeRequestHook = (
  hook: string
): hook is 'Merge Request Hook' => hook === 'Merge Request Hook';
export const isPipelineHook = (hook: string): hook is 'Pipeline Hook' =>
  hook === 'Pipeline Hook';

export interface EventTypes {
  'Note Hook': CommentEvent;
  'Merge Request Hook': MergeRequestEvent;
  'Pipeline Hook': PipelineEvent;
}

export const isMergeRequestCreateEvent = (data: MergeRequestEvent): boolean =>
  data.changes?.merge_status?.current === 'preparing' &&
  data.changes?.merge_status?.previous === 'unchecked';

export const isMergeRequestMarkAsReadyEvent = (data: MergeRequestEvent): boolean =>
  /^(wip|draft):/i.test(data.changes?.title?.previous || '') &&
  !/^(wip|draft):/i.test(data.changes?.title?.current || '');

export const isMergeRequestApproveEvent = (data: MergeRequestEvent): boolean =>
  data.object_attributes.action === 'approved'

