import { IService, BaseService } from "src/generics/service/base.service";
import { CustomerDto } from "src/models/customer.dto";
import { ValidateCustomerDto } from "src/models/validatecustomer.dto";
import { Injectable } from "@nestjs/common";
import { Customer } from "src/entities/customer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectMapper, AutoMapper } from "nestjsx-automapper";
import { ExceptionHandler } from "src/generics/exception.handler";

export interface ICustomerService extends IService<CustomerDto>
{
    checkCustomer({email, series, number}: ValidateCustomerDto) : Promise<boolean>;
}

@Injectable()
export class CustomerService extends BaseService<Customer, CustomerDto> implements ICustomerService
{
    constructor(@InjectRepository(Customer) repository: Repository<Customer>, @InjectMapper() mapper: AutoMapper)
    {
        super(repository, mapper);
    }

    public async checkCustomer({email, series, number}: ValidateCustomerDto) : Promise<boolean>
    {
        try
        {
            const value: Customer = await this.repository.findOne({where : {email: email, series: series, number: number}});
            if(value == null) throw new Error(); 
            return true;
        }
        catch(err)
        {
            return false;
        } 
    }

    
    public MapDto(entity: Customer): CustomerDto
    {
        return this.mapper.map(entity, CustomerDto, Customer);
    }

    public MapEntity(dto: CustomerDto): Customer
    {
        return this.mapper.map(dto, Customer, CustomerDto);
    }

    public MapDtos(entities: Array<Customer>): Array<CustomerDto>
    {
        return this.mapper.mapArray(entities, CustomerDto, Customer);
    }

    public MapEntities(dtos: Array<CustomerDto>): Array<Customer>
    {
        return this.mapper.mapArray(dtos, Customer, CustomerDto);
    }

    public onBeforeInsert(dto: CustomerDto): Customer
    {
        const value: Customer = this.mapper.map(dto, Customer, CustomerDto);
        value.id = 0;

        return value;
    }

    public onAfterInsert(entity: Customer): CustomerDto
    {
        return this.MapDto(entity);
    }
}