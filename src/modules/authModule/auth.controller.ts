import { Controller, Post, Body, Get, ValidationPipe, Request, UseGuards, Inject } from '@nestjs/common';
import { IAuthService } from './auth.service';
import { Credentials } from '../../models/credentials.dto';
import { UserDto, RegisterUserDto } from 'src/models/user.dto';
import { JwtAuthGuard } from './auth.guard';
import { ICustomerService } from '../customerModule/Customer.service';
import { ValidateCustomerDto } from 'src/models/validatecustomer.dto';
import { ApiResponse } from 'src/models/response.class';
import { CodeValidation } from '../../models/code.validation';
import { IEmailLogService } from '../emailLogModule/email.log.service';
import { NotificationService } from '../shared/notification.service';
import { SelectItem } from 'src/models/selectitem';
import { CodeConfirmation } from 'src/models/codeconfirmation';

@Controller('auth')
export class AuthController {

    private readonly authService: IAuthService;
    private readonly customerService: ICustomerService;
    private readonly emailLoggerService: IEmailLogService;
    private readonly notificationService: NotificationService;

    constructor(@Inject("IAuthService") authService: IAuthService, 
        @Inject("ICustomerService") customerService: ICustomerService,
        @Inject("IEmailLogService") emailLoggerService: IEmailLogService,
        notificationService: NotificationService)
    {
        this.authService = authService;
        this.customerService=customerService;
        this.emailLoggerService = emailLoggerService;
        this.notificationService = notificationService;
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public index(): string
    {
        return "ok";
    }

    @Post("/register")
    public async register(@Body(ValidationPipe) user: RegisterUserDto)
    {
        return await this.authService.register(user);
    }

    @Post('/login')
    public async login(@Body(ValidationPipe) credentials: Credentials)
    {
        return await this.authService.login(credentials);
    }

    @Post('/checkCustomer')
    public async checkCustomer(@Body(ValidationPipe) data: ValidateCustomerDto) : Promise<CodeConfirmation>
    {
        try
        {
            const response: boolean = await this.customerService.checkCustomer(data); 
            if(response != true) throw new Error();
            const userDto: UserDto = new UserDto();
            userDto.email = data.email; 

            const buffer: SelectItem<string, string>[] = [];
            const codeItem: SelectItem<string, string> = new SelectItem<string, string>();
            codeItem.value = 'model.code';  
            codeItem.text = await this.emailLoggerService.generateCode();          
            buffer.push(codeItem);

            await this.notificationService.sendCode(userDto, buffer);

            return new CodeConfirmation(true, "ok", codeItem.text, 60);
        }
        catch(err)
        {
            return new CodeConfirmation(false, err.message, null, -1);
        }
    }

    @Post('/checkRegisterCode')
    public async checkRegisterCode(@Body(ValidationPipe) item: CodeValidation): Promise<ApiResponse>
    {
        const isValid: boolean = await this.emailLoggerService.validateCode(item.code);
        
        return new ApiResponse(isValid, isValid == true ? "ok" : "does not exist");
    }
}
