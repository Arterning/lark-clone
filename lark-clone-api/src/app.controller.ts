import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SkipJwtAuth } from './auth/constants';

@ApiTags('主应用')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @SkipJwtAuth()
  @Get('/hello')
  index() {
    return this.appService.getHello();
  }
}
