import {
  BadRequestException,
  Body,
  Controller, Get,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  Res
} from '@nestjs/common';
import { GitlabHooksService } from '../gitlab/gitlab-hooks/gitlab-hooks.service';
import { IntegrationService } from './integration.service';
import { Request, Response } from 'express';
import { CommentEvent, MergeRequestEvent, PipelineEvent } from '../types';

@Controller()
export class IntegrationController {
  constructor(
    @Inject(GitlabHooksService)
    private readonly hooks: GitlabHooksService,
    @Inject(IntegrationService)
    private readonly integration: IntegrationService
  ) {}

  @Get('/')
  public test() {
    return "I do believe it's working good.";
  }

  @Post('/')
  public async dispatch(
    @Req() req: Request,
    @Body() body: MergeRequestEvent | CommentEvent | PipelineEvent,
    @Res() res: Response
  ) {
    const gitlabEvent = req.header('X-Gitlab-Event');
    if (!gitlabEvent) {
      throw new BadRequestException('Not a gitlab event');
    }
    let hasProcessed = true;
    try {
      if (this.hooks.isMergeRequestHook(gitlabEvent)) {
        await this.integration.mergeRequest(body as MergeRequestEvent);
      } else if (this.hooks.isNoteHook(gitlabEvent)) {
        await this.integration.comment(body as CommentEvent);
      } else if (this.hooks.isPipelineHook(gitlabEvent)) {
        await this.integration.pipeline(body as PipelineEvent);
      } else {
        hasProcessed = false;
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    if (!hasProcessed) {
      throw new BadRequestException(`No such action ${gitlabEvent}`);
    }
    res.sendStatus(204);
  }
}
