import { Module } from '@nestjs/common';
import { RuntimeStorageService } from './runtime-storage/runtime-storage.service';

@Module({
  providers: [RuntimeStorageService],
  exports: [RuntimeStorageService],
})
export class StorageModule {}
