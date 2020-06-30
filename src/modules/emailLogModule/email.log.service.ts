import { Injectable } from "@nestjs/common";
import { BaseService, IService } from "src/generics/service/base.service";
import { EmailLog } from "src/entities/email.log.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectMapper, AutoMapper } from "nestjsx-automapper";
import { EmailLogDto } from "src/models/email.log.dto";
import { Guid } from "guid-typescript";
import { isNullOrUndefined } from "util";

export interface IEmailLogService extends IService<EmailLogDto>
{
    validateCode(action: string, email: string): Promise<boolean>;
    generateCode(action: string, email: string): Promise<string>;
    
    getByGuid(guid: string): Promise<any>;
    generateGuid(action: string, email: string): Promise<string>;

}

@Injectable()
export class EmailLogService extends BaseService<EmailLog, EmailLogDto> implements IEmailLogService
{
    constructor(@InjectRepository(EmailLog) repository: Repository<EmailLog>, @InjectMapper() mapper: AutoMapper)
    {
        super(repository, mapper);
    }

    public async validateCode(code: string, email: string): Promise<boolean>
    {
        const item: EmailLog = await this.repository.findOne({ where: { code : code, email: email } });
        const currentDate: Date = new Date();
        const diff: number = (currentDate.getTime() - item.createdOn.getTime()) / 1000;
        return (diff > 120 || diff < 0) ? false : true;
    }

    public async generateCode(action: string, email: string): Promise<string>
    {
        try
        {
            if (isNullOrUndefined(action))
                throw new Error();
            const item: EmailLog = new EmailLog();
            item.code = this.randomCode();
            item.createdOn = new Date();
            item.action = action;
            item.guid = Guid.create().toString();
            item.email = email;

            await this.repository.insert(item);

            return item.code;
        }
        catch(err)
        {
            return null;
        } 
    }

    public async generateGuid(action: string, email: string): Promise<string>
    {
        try
        {
            if (isNullOrUndefined(action))
                throw new Error();
            const item: EmailLog = new EmailLog();
            item.code = this.randomCode();
            item.createdOn = new Date();
            item.action = action;
            item.guid = Guid.create().toString();
            item.email = email;

            await this.repository.insert(item);

            return item.guid;
        }
        catch(err)
        {
            return null;
        } 
    }

    public async getByGuid(guid: string): Promise<any>
    {
        return this.repository.findOne({ where: { guid: guid } });
    }

    public randomCode(): string
    {
        let min = 0, max = 50000;
        return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    }
    
    
    public MapDto(entity: EmailLog): EmailLogDto
    {
        return this.mapper.map(entity, EmailLogDto, EmailLog);
    }

    public MapEntity(dto: EmailLogDto): EmailLog
    {
        return this.mapper.map(dto, EmailLog, EmailLogDto);
    }

    public MapDtos(entities: Array<EmailLog>): Array<EmailLogDto>
    {
        return this.mapper.mapArray(entities, EmailLogDto, EmailLog);
    }

    public MapEntities(dtos: Array<EmailLogDto>): Array<EmailLog>
    {
        return this.mapper.mapArray(dtos, EmailLog, EmailLogDto);
    }

    public onBeforeInsert(dto: EmailLogDto): EmailLog
    {
        const value: EmailLog = this.mapper.map(dto, EmailLog, EmailLogDto);
        value.id = 0;

        return value;
    }

    public onAfterInsert(entity: EmailLog): EmailLogDto
    {
        return this.MapDto(entity);
    }
}