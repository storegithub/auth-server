import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller"; 
import { UserModule } from "../userModule/user.module";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';
import { JwtStrategy } from './jwtStrategy.service';
import { SharedModule } from "../shared/shared.module";
import { CustomerModule } from "../customerModule/customer.module";
import { CustomerService } from "../customerModule/Customer.service";
import { Customer } from "src/entities/customer.entity";
import { EmailLogModule } from "../emailLogModule/email.log.module";
import { DictionaryModule } from "../dictionaryModule/dictionary.module";
import { AddressModule } from "../addressModule/address.module";


@Module({
    imports: [
        UserModule, 
        SharedModule,
        EmailLogModule,
        DictionaryModule,
        AddressModule,
        CustomerModule,
        PassportModule.register({      
            defaultStrategy: 'jwt',      
            property: 'user',      
            session: false,    
        }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '5h' }
        }),
        CustomerModule
    ],
    controllers: [ AuthController ],
    providers: [ { provide: "IAuthService", useClass: AuthService }, JwtStrategy ],
    exports: [ JwtStrategy, { provide: "IAuthService", useClass: AuthService }, PassportModule ]
})
export class AuthModule{}