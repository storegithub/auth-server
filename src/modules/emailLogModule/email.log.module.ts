import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailLog } from "src/entities/email.log.entity";
import { EmailLogService } from "./email.log.service";

@Module({
    imports: [TypeOrmModule.forFeature([EmailLog])],
    controllers:[
    ],
    providers: [
        { provide: "IEmailLogService", useClass: EmailLogService }
    ],
    exports: [
        { provide: "IEmailLogService", useClass: EmailLogService }
    ]
})
export class EmailLogModule{}