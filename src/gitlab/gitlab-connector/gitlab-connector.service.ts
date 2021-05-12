import { Inject, Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { ConfigService } from '@nestjs/config';
import { GitlabConfig, Setup } from '../../types';

@Injectable()
export class GitlabConnectorService {
  private readonly http: AxiosInstance;
  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService<Setup>
  ) {
    const gitlabConfig = this.cfg.get<GitlabConfig>('gitlab');
    this.http = axios.create({
      baseURL: gitlabConfig.baseUrl,
      headers: {
        Authorization: `Bearer ${gitlabConfig.accessToken}`,
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
  }

  async assignLabelToMergeRequest(
    idProject: number,
    idMergeRequest: number,
  ): Promise<void> {
    const { labels } = this.cfg.get<GitlabConfig>('gitlab');
    const label = (Array.isArray(labels) ? labels : [labels]).join(',');
    await this.http.put(`/projects/${idProject}/merge_requests/${idMergeRequest}`, {
      labels: label,
    });
  };
}
