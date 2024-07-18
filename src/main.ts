import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
// https://docs.nestjs.com/techniques/logger
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'debug',
      defaultMeta: { service: 'example-microservice' },
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json(),
      ),
      transports: [new transports.Console()],
      exitOnError: false,
    }),
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  console.log('App is running on port 3000');
  Logger.log('App is running on port 3000', 'Bootstrap');
  await app.listen(3000);
}
bootstrap();
