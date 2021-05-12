import { User } from './User';
import { ArtifactFile } from './ArtifactFile';
import { Environment } from './Environment';
import { Runner } from './Runner';

export interface Build {
  id: number;
  stage: string;
  name: string;
  status: string;
  created_at?: string;
  started_at?: string;
  finished_at?: string;
  when: string;
  manual: boolean;
  allow_failure: boolean;
  user: User;
  artifacts_file: ArtifactFile;
  environment: Environment;
  runner: Runner;
}
