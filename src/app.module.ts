import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnectService } from './dbConnect.service'; 
import { AuthModule } from './modules/authModule/auth.module';
import { AutomapperModule } from 'nestjsx-automapper';
import './mappings/source.profile';
import { UserModule } from './modules/userModule/user.module';
import { SharedModule } from './modules/shared/shared.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { CustomerModule } from './modules/customerModule/customer.module';
import { EmailLogModule } from './modules/emailLogModule/email.log.module';

@Module({
  imports: [ 
    TypeOrmModule.forRootAsync({ useClass: dbConnectService }), 
    AutomapperModule.withMapper(),
    AuthModule,
    UserModule, 
    SharedModule,
    CustomerModule,
    EmailLogModule,
    MailerModule.forRootAsync({ 
      useFactory: () => ({
        transport: 'smtps://replayn.homebank@gmail.com:1Asdfghj@smtp.gmail.com',
        defaults: {
          from:'"nest-modules" modules@nestjs.com',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }) 
    })
  ]
})
export class AppModule {}
