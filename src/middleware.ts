import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, body } = request;
    this.logger.log(`${method} ${originalUrl} ${JSON.stringify(body)}`);

    const oldWrite = response.write;
    const oldEnd = response.end;
    const chunks = [];
    response.write = function (...args: any[]) {
      let [chunk] = args;
      // Ensure chunk is a Buffer before pushing
      if (typeof chunk === 'string') {
        chunk = Buffer.from(chunk);
      }
      chunks.push(chunk);
      return oldWrite.apply(response, args);
    };

    response.end = function (...args: any[]) {
      let [chunk] = args;
      // Ensure chunk is a Buffer before pushing, if it exists
      if (chunk && typeof chunk === 'string') {
        chunk = Buffer.from(chunk);
      }
      if (chunk) {
        chunks.push(chunk);
      }
      return oldEnd.apply(response, args);
    };

    response.on('finish', () => {
      const { statusCode } = response;
      const responseBody = Buffer.concat(chunks).toString('utf8');
      this.logger.log(
        `${statusCode} api: ${method} ${originalUrl} ${responseBody}`,
      );
    });

    next();
  }
}
