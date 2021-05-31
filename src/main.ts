import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Setup } from './types';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  const cfg = app.get<ConfigService<Setup>>(ConfigService);
  await app.listen(cfg.get<AppConfig>('app').port);
}
bootstrap();
