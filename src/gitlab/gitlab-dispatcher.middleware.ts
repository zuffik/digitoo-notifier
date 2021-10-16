import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GitlabHooksService } from './gitlab-hooks/gitlab-hooks.service';

@Injectable()
export class GitlabDispatcherMiddleware implements NestMiddleware {
  constructor(
    @Inject(GitlabHooksService)
    private readonly hooks: GitlabHooksService
  ) {}

  use(req: Request, res: Response, next: () => void) {
    const gitlabEvent = req.header('X-Gitlab-Event');
    if (!gitlabEvent) {
      throw new BadRequestException('Not a gitlab event');
    }
    if (this.hooks.isMergeRequestHook(gitlabEvent)) {
      return this.redirectTo('/gitlab/merge-request', res);
    } else if (this.hooks.isNoteHook(gitlabEvent)) {
      return this.redirectTo('/gitlab/comment', res);
    } else if (this.hooks.isPipelineHook(gitlabEvent)) {
      return this.redirectTo('/gitlab/pipeline', res);
    }
    next();
  }

  private redirectTo(url: string, res: Response) {
    return res.redirect(308, url);
  }
}
