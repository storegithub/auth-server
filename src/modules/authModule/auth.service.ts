import { Injectable, BadRequestException, NotImplementedException, Inject, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common'; 
import { UserDto, UserLiteDto } from 'src/models/user.dto';
import { ApiResponse } from 'src/models/response.class';
import { isNullOrUndefined } from 'util';
import { InjectMapper, AutoMapper } from 'nestjsx-automapper';
import { IUserService } from '../userModule/user.service';
import { JwtService } from '@nestjs/jwt'; 
import { Credentials, Payload } from 'src/models/credentials.dto';
import { OperationResult } from 'src/models/operation.result.dto';
import { ExceptionHandler } from 'src/generics/exception.handler';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface IAuthService
{
    login({ userName, password } : Credentials): Promise<UserLiteDto>;
    register(uer: UserDto);
    hashPassword(password: string): string; 
    comparePasswords(newPassword: string, passwordHash: string): string;
}

@Injectable()
export class AuthService implements IAuthService {
     private readonly mapper: AutoMapper;
     private readonly userService: IUserService;
     private readonly jwtService: JwtService;

    constructor(
        @Inject('IUserService') userService: IUserService,
        @InjectMapper() mapper: AutoMapper,
        jwtService: JwtService)
    {
        this.mapper = mapper;
        this.userService = userService;
        this.jwtService = jwtService;
    }
 
    async login({ userName, password } : Credentials): Promise<UserLiteDto> {
        const user: UserDto = await this.userService.findActiveOne(userName);
        if (!isNullOrUndefined(user) && user.password === password)
            return await this.getLiteInfo(user);
        
        throw new UnauthorizedException();
    }

    async register(user: UserDto)
    {
        const { userName } = user;
        let appUser: UserDto =  await this.userService.findOne(userName);
        if(!isNullOrUndefined(appUser))
            throw new Error();

        const result: OperationResult<UserDto> = await this.userService.insert(user);
        if (!result.success)
            throw new Error();

        
        return new ApiResponse(true, "Contul a fost inregistrat cu success!");
    }

    public async validateUser(payload: Payload): Promise<UserDto> {
        const user = await this.userService.findActiveOne(payload.userName);    
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
        }    
        return user;  
    }


    private async getLiteInfo(user: UserDto): Promise<UserLiteDto>
    {
        let info: UserLiteDto;
        try
        {
            info = this.mapper.map(user, UserLiteDto, UserDto);
            
            let jwtUser = {
                userName: user.userName,
                email: user.id,
                id: user.id
            };

            info.token = await this.jwtService.signAsync({ user: jwtUser }, { expiresIn: "5d" });
        }
        catch(error)
        {
            ExceptionHandler.Log(error);
        }

        return info;
    }


    public hashPassword(password: string): string
    {
        return  bcrypt.hash(password, 12);
    }

    public comparePasswords(newPassword: string, passwordHash: string): string
    {
        return bcrypt.compare(newPassword, passwordHash);
    }
    
}