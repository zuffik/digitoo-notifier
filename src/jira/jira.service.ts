import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import JiraClient from 'jira-connector';
import { JiraConfig, Setup } from '../types';
import btoa from 'btoa';

@Injectable()
export class JiraService {
  private readonly jira: JiraClient;
  private readonly taskPrefix: string;

  constructor(
    @Inject(ConfigService)
    private readonly cfg: ConfigService<Setup>
  ) {
    const jira = this.cfg.get<JiraConfig>('jira');
    this.jira = new JiraClient({
      host: jira.taskDomain,
      basic_auth: {
        base64: btoa(jira.email + ':' + jira.apiToken),
      },
    });
    this.taskPrefix = jira.taskPrefix;
  }

  public async getIssue(id: string) {
    const issue = id.startsWith(this.taskPrefix)
      ? id
      : `${this.taskPrefix}-${id}`;
    return await this.jira.issue.getIssue({ issueKey: issue });
  }
}
