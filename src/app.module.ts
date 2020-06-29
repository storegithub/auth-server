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

@Module({
  imports: [ 
    TypeOrmModule.forRootAsync({ useClass: dbConnectService }), 
    AutomapperModule.withMapper(),
    AuthModule,
    UserModule, 
    SharedModule
  ]
})
export class AppModule {}
