import { BaseService } from "src/generics/service/base.service";
import { User } from "src/entities/user.entity";
import { UserDto } from "src/models/user.dto";
import { Repository, InsertResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { IService } from "src/generics/service/base.service";
import { AutoMapper, InjectMapper } from "nestjsx-automapper";
import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { isNullOrUndefined } from "util";
import { ICustomerService } from "../customerModule/Customer.service";
import { OperationResult } from "src/models/operation.result.dto";

export interface IUserService extends IService<UserDto> 
{
    findOne(userName: string): Promise<UserDto>;
    findOneByEmail(email: string): Promise<UserDto>;
    findActiveOne(userName: string): Promise<UserDto>;
    SetActiveByEmail(email: string): Promise<any>;
    findOneByCustomerId(customerId: number): Promise<UserDto>;
}

@Injectable()
export class UserService extends BaseService<User, UserDto> implements IUserService
{
    private readonly customerService: ICustomerService;
    constructor(@InjectRepository(User) repository: Repository<User>, @InjectMapper() mapper: AutoMapper, 
        @Inject("ICustomerService") customerService: ICustomerService)
    {
        super(repository, mapper);
        this.customerService=customerService;
    }
    public async findOneByCustomerId(customerId: number): Promise<UserDto> {
        const user: User = await this.repository.findOne({ where: { customerId: customerId, active: true } });

        return this.MapDto(user);
    }

    public async findOne(userName: string): Promise<UserDto>
    {
        if (isNullOrUndefined(userName))
            throw new BadRequestException("Invalid credentials!");

        const result: Array<UserDto> = await this.filter({ userName });
        if(isNullOrUndefined(result) || result.length != 1)
            return null;
        return result[0];
    }

    public async findActiveOne(userName: string): Promise<UserDto>
    {
        if (isNullOrUndefined(userName))
            throw new BadRequestException("Invalid credentials!");

        const result: Array<UserDto> = await this.filter({ userName, active: true });
        if(isNullOrUndefined(result) || result.length != 1)
            return null;
        return result[0];
    }

    public async findOneByEmail(email: string): Promise<UserDto>
    {
        if (isNullOrUndefined(email))
            throw new BadRequestException("Invalid credentials!");

        const result: User = await this.repository.findOne({ where: { email: email, active: true } });
        
        return this.MapDto(result);
    }
     
    public async SetActiveByEmail(email: string): Promise<any>
    {
        if (isNullOrUndefined(email))
            throw new BadRequestException("Invalid credentials!");

        const result: User = await this.repository.findOne({ where: { email: email } });
        result.active = true;

        await this.repository.update(result.id, result);
    }

    public MapDto(entity: User): UserDto
    {
        return this.mapper.map(entity, UserDto, User);
    }

    public MapEntity(dto: UserDto): User
    {
        return this.mapper.map(dto, User, UserDto);
    }

    public MapDtos(entities: Array<User>): Array<UserDto>
    {
        return this.mapper.mapArray(entities, UserDto, User);
    }

    public MapEntities(dtos: Array<UserDto>): Array<User>
    {
        return this.mapper.mapArray(dtos, User, UserDto);
    }

    public onBeforeInsert(dto: UserDto): User
    {
        const user: User = this.mapper.map(dto, User, UserDto);

        user.id = 0;
        user.active = false;
        user.customerId = dto.customerId;
        user.email = dto.email;
        user.password = dto.password;
        user.userName = dto.userName;

        return user;
    }

    public onBeforeUpdate(dto: UserDto): User
    {
        const value: User = new User();
        value.email = dto.email;
        value.id = dto.id;
        if(dto.password != null)
            value.password = dto.password;
        return value;
    }

    public onAfterInsert(entity: User): UserDto
    {
        return this.MapDto(entity);
    }

    public onAfterUpdate(entity: User): UserDto
    {
        return this.MapDto(entity);
    }
}