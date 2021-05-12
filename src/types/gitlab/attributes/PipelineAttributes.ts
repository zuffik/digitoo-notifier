import { Variable } from '../Variable';

export interface PipelineAttributes {
  id: number;
  ref: string;
  tag: boolean;
  sha: string;
  before_sha: string;
  source: string;
  status: string;
  stages: string[];
  created_at: string;
  finished_at: string;
  duration: number;
  variables: Variable[];
}
