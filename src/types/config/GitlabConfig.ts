export interface GitlabConfig {
  accessToken: string;
  baseUrl: string;
  labels: string[] | string;
  members: number[];
}
