import { Inject, Injectable } from '@nestjs/common';
import { RuntimeStorageService } from '../../storage/runtime-storage/runtime-storage.service';

@Injectable()
export class IntegrationStorageService {
  constructor(
    @Inject(RuntimeStorageService)
    private readonly coreStorage: RuntimeStorageService<{
      mergeRequestThreads: Record<number, string>
    }>
  ) {
  }

  public createThreadForMergeRequest(mrId: number, threadId: string) {
    this.coreStorage.setItem('mergeRequestThreads', {
      ...this.coreStorage.getItem('mergeRequestThreads', {}),
      [mrId]: threadId
    });
  }

  public getThreadForMergeRequest(mrId: number): string | undefined {
    return this.coreStorage.getItem('mergeRequestThreads', {})[mrId];
  }
}
