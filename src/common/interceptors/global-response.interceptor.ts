import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { GlobalResponseClass } from '../classes/global-response.class';
import { Request, Response } from 'express';

export class ResponseOkInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<GlobalResponseClass>
    | Promise<Observable<GlobalResponseClass>> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    let statusCode: number = res.statusCode;
    let status: string;
    statusCode < 400 ? (status = 'success') : (status = 'failed');
    return next
      .handle()
      .pipe(map((data) => new GlobalResponseClass(status, statusCode, data)));
  }
}
