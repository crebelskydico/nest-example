import { Catch, HttpException, Logger } from '@nestjs/common';
// https://docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    Logger.error(`error on ${request.url}`, 'HttpExceptionFilter');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
