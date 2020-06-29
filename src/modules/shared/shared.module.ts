import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { HttpExceptionFilter } from './http-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';import { NotificationService } from './notification.service';
import { MailerService } from '@nestjs-modules/mailer';
 ;

@Module({
  imports: [],
  providers: [
      {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    NotificationService
  ],
  exports: [
    NotificationService,
  ],
})
export class SharedModule {}