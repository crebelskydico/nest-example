import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('error')
export class ErrorController {
  constructor() {}
  @Get()
  getError(): string {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
