import { User } from '../User';
import { Project } from '../Project';
import { Repository } from '../Repository';
import { MergeRequestAttributes } from '../attributes/MergeRequestAttributes';
import { Label } from '../Label';
import { Change } from '../Change';
import { MergeRequestChanges } from '../changes/MergeRequestChanges';

export interface MergeRequestEvent {
  object_kind: 'merge_request';
  user: User;
  project: Project;
  repository: Repository;
  object_attributes: MergeRequestAttributes;
  labels: Label[];
  assignees: User[];
  changes: Partial<
    { [K in keyof MergeRequestChanges]: Change<MergeRequestChanges[K]> }
  >;
}
