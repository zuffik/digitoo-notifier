import { Position } from '../Position';

export interface NoteAttributes {
  attachment: string;
  author_id: number;
  change_position: {
    base_sha: string;
    start_sha: string;
    head_sha: string;
    old_path: string;
    new_path: string;
    position_type: string;
    old_line: string;
    new_line: string;
    line_range: string;
  };
  commit_id: string;
  created_at: string;
  discussion_id: string;
  id: number;
  line_code: string;
  note: string;
  noteable_id: number;
  noteable_type: string;
  original_position: Position;
  position: Position;
  project_id: number;
  resolved_at: string;
  resolved_by_id: string;
  resolved_by_push: string;
  st_diff: string;
  system: false;
  type: string;
  updated_at: string;
  updated_by_id: string;
  description: string;
  url: string;
}
