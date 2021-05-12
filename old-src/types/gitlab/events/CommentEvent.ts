import { MergeRequestAttributes } from '../attributes/MergeRequestAttributes';
import { NoteAttributes } from '../attributes/NoteAttributes';
import { User } from '../User';
import { Project } from '../Project';
import { Repository } from '../Repository';
import { Snippet } from '../Snippet';

export interface CommentEvent {
  object_kind: 'note';
  user: User;
  project_id: number;
  project: Project;
  repository: Repository;
  object_attributes: NoteAttributes;
  merge_request: MergeRequestAttributes;
  snippet?: Snippet;
}
