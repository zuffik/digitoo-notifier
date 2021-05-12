import { PipelineAttributes } from '../attributes/PipelineAttributes';
import { MergeRequestAttributes } from '../attributes/MergeRequestAttributes';
import { User } from '../User';
import { Project } from '../Project';
import { Commit } from '../Commit';
import { Build } from '../Build';

export interface PipelineEvent {
  object_kind: 'pipeline';
  object_attributes: PipelineAttributes;
  merge_request: MergeRequestAttributes;
  user: User;
  project: Project;
  commit: Commit;
  builds: Build[];
}
