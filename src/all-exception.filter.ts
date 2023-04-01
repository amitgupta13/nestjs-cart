import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.name) {
      case 'ValidationError':
        const validationErrors: any = {};
        Object.keys(exception.errors).map(
          (key: any) => (validationErrors[key] = exception.errors[key].message),
        );
        return this.sendResponse(
          response,
          status,
          validationErrors,
          exception.name,
        );
      default:
        return exception.response
          ? response.status(status).json(exception.getResponse())
          : response.status(status).json({
              status,
              message: exception.message,
              error: exception,
            });
    }
  }

  private sendResponse(
    response: Response,
    status: number = 500,
    error: any = {},
    message = 'Internal Server Error',
  ) {
    return response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
