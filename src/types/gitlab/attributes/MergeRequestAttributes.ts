import { Project } from '../Project';
import { Commit } from '../Commit';

export interface MergeRequestAttributes {
  id: number;
  target_branch: string;
  source_branch: string;
  source_project_id: number;
  author_id: number;
  assignee_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  milestone_id?: number;
  state: string;
  merge_status: string;
  target_project_id: number;
  iid: number;
  description: string;
  source: Project;
  target: Project;
  last_commit: Commit;
  work_in_progress: boolean;
  url: string;
  action: string;
  assignee_ids: number[];
}
