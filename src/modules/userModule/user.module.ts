import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { CustomerModule } from "../customerModule/customer.module";
import { CustomerService } from "../customerModule/Customer.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]), PassportModule, CustomerModule],
    providers: [{ provide: 'IUserService', useClass: UserService }],
    controllers: [UserController],
    exports: [{ provide: 'IUserService', useClass: UserService }]
})
export class UserModule {}