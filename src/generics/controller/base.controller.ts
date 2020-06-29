import { BaseService } from "../service/base.service";
import { IService } from "../service/base.service";
import { Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/authModule/auth.guard";

export class BaseController<T extends object>
{
    protected readonly service: IService<T>;

    constructor(service: IService<T>)
    {
        this.service = service;
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public getAll(): Promise<Array<T>>
    {
        return this.service.getAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    public getById(@Param('id') id: number): Promise<T>
    {
        return this.service.getById(id);
    }
}