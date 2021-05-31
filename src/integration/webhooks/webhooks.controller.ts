import { Controller, HttpCode, Post } from '@nestjs/common';

@Controller('webhooks')
export class WebhooksController {
  @Post('gitlab')
  @HttpCode(404)
  public async gitlab() {
    return;
  }
}
