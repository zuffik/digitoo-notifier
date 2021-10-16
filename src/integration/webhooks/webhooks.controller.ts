import { Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { JiraService } from '../../jira/jira.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    @Inject(JiraService)
    private readonly jiraService: JiraService
  ) {}

  @Post('gitlab')
  @HttpCode(404)
  public async gitlab() {
    return;
  }

  @Post('jira')
  public async jira() {
    console.log(await this.jiraService.getIssue('DIG-1936'));
  }
}
