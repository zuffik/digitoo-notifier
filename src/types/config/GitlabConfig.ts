export interface GitlabConfig {
  accessToken: string;
  baseUrl: string;
  labels: string[] | string;
  members: number[];
  targetBranchesWhitelist: string[];
  sourceBranchesBlacklist: string[];
  reportPipelinesBranches: string[];
}
