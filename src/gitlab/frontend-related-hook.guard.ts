import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GitlabHooksService } from './gitlab-hooks/gitlab-hooks.service';
import { Request } from 'express';

@Injectable()
export class FrontendRelatedHookGuard implements CanActivate {
  constructor(
    @Inject(GitlabHooksService)
    private readonly hooks: GitlabHooksService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.hooks.isFrontendRelatedHook(
      context.switchToHttp().getRequest<Request>().body
    );
  }
}
