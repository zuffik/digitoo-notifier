import { Inject, Injectable } from '@nestjs/common';
import { RuntimeStorageService } from '../../storage/runtime-storage/runtime-storage.service';

@Injectable()
export class GitlabStorageService {
  constructor(
    @Inject(RuntimeStorageService)
    private readonly coreStorage: RuntimeStorageService<{
      codeReviews: Record<string, string[]>;
    }>
  ) {
  }

  public addCodeReview(mrId: number, dateTime: string) {
    const crs = this.coreStorage.getItem('codeReviews') || {};
    if (!crs[mrId]) {
      crs[mrId] = [];
    }
    if (!crs[mrId].includes(dateTime)) {
      crs[mrId].push(dateTime);
    }
    this.coreStorage.setItem('codeReviews', crs);
  }

  public codeReviewExists(mrId: number, dateTime: string): boolean {
    return !!(this.coreStorage.getItem('codeReviews') || {})?.[mrId]?.includes(dateTime);
  }
}
