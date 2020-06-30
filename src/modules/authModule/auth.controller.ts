import { Controller, Post, Body, Get, ValidationPipe, Request, UseGuards, Inject, Param, Put } from '@nestjs/common';
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
import { IProfile, Profile } from 'src/models/profile.dto';
import { ICode } from 'src/models/send.code';
import { CustomerDto } from 'src/models/customer.dto';
import { IUserService } from '../userModule/user.service';
import { IChangePassword } from 'src/models/changePassword.interface';

@Controller('auth')
export class AuthController {

    private readonly authService: IAuthService;
    private readonly customerService: ICustomerService;
    private readonly emailLoggerService: IEmailLogService;
    private readonly notificationService: NotificationService;
    private readonly userService: IUserService;

    constructor(@Inject("IAuthService") authService: IAuthService, 
        @Inject("ICustomerService") customerService: ICustomerService,
        @Inject("IUserService") userService: IUserService,
        @Inject("IEmailLogService") emailLoggerService: IEmailLogService,
        notificationService: NotificationService)
    {
        this.authService = authService;
        this.customerService=customerService;
        this.emailLoggerService = emailLoggerService;
        this.notificationService = notificationService;
        this.userService = userService;
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

            return new CodeConfirmation(true, "ok", null, 60);
        }
        catch(err)
        {
            return new CodeConfirmation(false, err.message, null, -1);
        }
    }

    @Post('/sendCode')
    public async sendCode(@Body() model: ICode)
    {
        try
        { 
            const userDto: UserDto = new UserDto();
            userDto.email = model.email; 

            const buffer: SelectItem<string, string>[] = [];
            const codeItem: SelectItem<string, string> = new SelectItem<string, string>();
            codeItem.value = 'model.code';  
            codeItem.text = await this.emailLoggerService.generateCode("register", model.email);          
            buffer.push(codeItem);

            await this.notificationService.sendCode(userDto, buffer);

            return new CodeConfirmation(true, "ok", null, 60);
        }
        catch(err)
        {
            return new CodeConfirmation(false, err.message, null, -1);
        } 
    }

    @Post('/checkRegisterCode')
    public async checkRegisterCode(@Body(ValidationPipe) item: CodeValidation): Promise<ApiResponse>
    {
        const isValid: boolean = await this.emailLoggerService.validateCode(item.code, item.email);
        
        return new ApiResponse(isValid, isValid == true ? "ok" : "does not exist");
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:userId')
    public async getProfile(@Param('userId') userId: number): Promise<IProfile>
    {
        return await this.authService.myProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    public async updateProfile(@Body() profile: Profile): Promise<IProfile>
    {
       try
       {
            const data: IProfile = await this.authService.updateProfile(profile);
            return data;
       }
       catch(err)
       {
            return new Profile();
       }
    } 

    @Get('/validateaccount/:data')
    public async validateAccount(@Param('data') data: string)
    {
        return await this.authService.validateAccount(data);
    }

    @Post('/checkUser')
    public async checkUser(@Body(ValidationPipe) data: ValidateCustomerDto) : Promise<CodeConfirmation>
    {
        try
        {
            const customer: CustomerDto = await this.customerService.checkUser(data); 
            if(customer == null) throw new Error();
            
            const userDto: UserDto = await this.userService.findOneByCustomerId(customer.id); 
            if(userDto == null ) throw new Error();

            return new CodeConfirmation(true, "ok", null, 60);
        }
        catch(err)
        {
            return new CodeConfirmation(false, err.message, null, -1);
        }
    }

    @Post('/changePassword')
    public async changePassword(@Body() model: IChangePassword)
    {
        try
        { 
            if(model.password != model.password) throw new Error();

            const customer: CustomerDto = await this.customerService.checkUser({ email: model.email, number: model.number, series: model.series }); 
            if(customer == null) throw new Error();
            
            const userDto: UserDto = await this.userService.findOneByCustomerId(customer.id); 
            if(userDto == null ) throw new Error();
            
            userDto.password = this.authService.hashPassword(model.password, userDto.userName);
            userDto.active = false;

            await this.userService.update(userDto);

            const buffer: SelectItem<string, string>[] = [];
            const codeItem: SelectItem<string, string> = new SelectItem<string, string>();
            codeItem.value = 'model.code';  
            codeItem.text = await this.emailLoggerService.generateGuid("change.password", model.email);          
            buffer.push(codeItem);

            await this.notificationService.sendChangePassword(userDto, buffer);

            return new CodeConfirmation(true, "ok", null, 60);
        }
        catch(err)
        {
            return new CodeConfirmation(false, err.message, null, -1);
        } 
    }

    @Post('/resetPasswordCode')
    public async resetPasswordCode(@Body() model: ICode)
    {
        try
        { 
            const userDto: UserDto = new UserDto();
            userDto.email = model.email; 

            const buffer: SelectItem<string, string>[] = [];
            const codeItem: SelectItem<string, string> = new SelectItem<string, string>();
            codeItem.value = 'model.code';  
            codeItem.text = await this.emailLoggerService.generateCode("reset.password.code", model.email);          
            buffer.push(codeItem);

            await this.notificationService.sendCode(userDto, buffer);

            return new CodeConfirmation(true, "ok", null, 60);
        }
        catch(err)
        {
            return new CodeConfirmation(false, err.message, null, -1);
        } 
    }
}
