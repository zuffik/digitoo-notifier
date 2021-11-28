export interface GitlabConfig {
  accessToken: string;
  baseUrl: string;
  labels: string[] | string;
  members: number[];
  targetBranchesWhitelist: (string | RegExp)[];
  sourceBranchesBlacklist: (string | RegExp)[];
  reportPipelinesBranches: (string | RegExp)[];
}
