import { RangePoint } from './RangePoint';

export interface Position {
  base_sha: string;
  start_sha: string;
  head_sha: string;
  old_path: string;
  new_path: string;
  position_type: string;
  old_line: string;
  new_line: number;
  line_range: {
    start: RangePoint;
    end: RangePoint;
  };
}
