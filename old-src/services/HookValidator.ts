import {
  CommentEvent,
  EventBody,
  isCommentEventBody,
  isMergeRequestEventBody,
  isPipelineEventBody,
  MergeRequestAttributes
} from '../types';
import { GitlabConfig } from "../types/config";

const isMergeRequestRelatedToFrontend = (
  mr: MergeRequestAttributes,
  members: number[]
): boolean =>
  !!(
    (mr.assignee_ids && mr.assignee_ids.find((id) => members.includes(id))) ||
    members.includes(mr.assignee_id) ||
    members.includes(mr.author_id)
  );

export const isFrontendRelatedHook = (
  data: EventBody,
  relations: GitlabConfig
): boolean => {
  if (isMergeRequestEventBody(data)) {
    return Boolean(
      data.labels.findIndex((l) => relations.labels.includes(l.title)) >= 0 ||
        relations.members.includes(data.user.id) ||
        isMergeRequestRelatedToFrontend(
          data.object_attributes,
          relations.members
        )
    );
  } else if (isCommentEventBody(data)) {
    return Boolean(
      data.merge_request &&
        isMergeRequestRelatedToFrontend(data.merge_request, relations.members)
    );
  } else if (isPipelineEventBody(data)) {
    return Boolean(
      data.merge_request &&
        isMergeRequestRelatedToFrontend(data.merge_request, relations.members)
    );
  }
  return false;
};

export const isCommentHookCodeReview = (data: CommentEvent): boolean =>
  data.merge_request.author_id !== data.object_attributes.author_id;
