import { Injectable, BadRequestException, NotImplementedException, Inject, UnauthorizedException, HttpException, HttpStatus, Param } from '@nestjs/common'; 
import { UserDto, UserLiteDto, RegisterUserDto } from 'src/models/user.dto';
import { ApiResponse } from 'src/models/response.class';
import { isNullOrUndefined } from 'util';
import { InjectMapper, AutoMapper } from 'nestjsx-automapper';
import { IUserService } from '../userModule/user.service';
import { JwtService } from '@nestjs/jwt'; 
import { Credentials, Payload } from 'src/models/credentials.dto';
import { OperationResult } from 'src/models/operation.result.dto';
import { ExceptionHandler } from 'src/generics/exception.handler';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../shared/notification.service';
import { ICustomerService } from '../customerModule/Customer.service';
import { CustomerDto } from 'src/models/customer.dto';
import { IProfile, Profile } from 'src/models/profile.dto';
import { IAddressService } from '../addressModule/address.service';
import { AddressDto } from 'src/models/Address.dto';
import { IDictionaryDetailService } from '../dictionaryModule/dictionaryDetail.service';
import { DictionaryDetailDto } from 'src/models/dictionaryDetail.dto';
import { SelectItem } from 'src/models/selectitem';
import { Md5 } from 'ts-md5/dist/md5'

export interface IAuthService
{
    login({ userName, password } : Credentials): Promise<UserLiteDto>;
    register(uer: RegisterUserDto);
    myProfile(userId: number) :Promise<IProfile>;
    hashPassword(password: string, username: string): string; 
    comparePasswords(username: string, password: string, passwordHash: string): boolean;
    updateProfile(profile: Profile): Promise<IProfile>;
}

@Injectable()
export class AuthService implements IAuthService {
     private readonly mapper: AutoMapper;
     private readonly userService: IUserService;
     private readonly jwtService: JwtService;
     private readonly addressService: IAddressService;

     private readonly customerService: ICustomerService;
     private readonly dictionaryDetailService: IDictionaryDetailService;

    constructor(
        @Inject('IUserService') userService: IUserService,
        @Inject('ICustomerService') customerService: ICustomerService,
        @Inject('IAddressService') addressService: IAddressService,
        @Inject('IDictionaryDetailService') dictionaryDetailService: IDictionaryDetailService,
        @InjectMapper() mapper: AutoMapper,
        jwtService: JwtService,
        private readonly notificationService: NotificationService)
    {
        this.mapper = mapper;
        this.userService = userService;
        this.jwtService = jwtService;
        this.customerService = customerService;
        this.addressService = addressService;
        this.dictionaryDetailService = dictionaryDetailService;
    }

    public async myProfile(userId: number) :Promise<IProfile>
    {
        const dropdown: DictionaryDetailDto[] = await this.dictionaryDetailService.getByDictionary("dropdown.gender");

        const currentUser: UserDto = await this.userService.getById(userId);
        if(currentUser == null)
            return new Profile();

        const currentPerson: CustomerDto = await this.customerService.getById(currentUser.customerId);
        let currentAddress: AddressDto = null;
        if(currentPerson.addressId != null)
            currentAddress = await this.addressService.getById(currentPerson.addressId);

        const profile: IProfile = {
            userName: currentUser.userName,
            addressDetail: currentAddress != null ? currentAddress.details : null,
            branch: currentPerson.branchId.toString(),
            branchName: currentPerson.branchName,
            city : currentAddress != null ? currentAddress.city : null,
            details: currentPerson.details,
            email: currentUser.email,
            firstName: currentPerson.name,
            lastName: currentPerson.surname,
            gender: currentPerson.gender,
            genderDropDown: dropdown.map(item => {
                const selectItem: SelectItem<string, string> = new SelectItem<string, string>();

                selectItem.value = item.name;
                selectItem.text = item.value;

                return selectItem;
            }),
            phoneNo: currentPerson.phoneNo,
            postalCode: currentAddress != null ? currentAddress.zipCode : null
        };

        return profile;
    }

    public async updateProfile(profile: Profile): Promise<IProfile>
    {
        try
        {
            const userDto: UserDto = await this.userService.getById(profile.userId);
            if(userDto == null) throw new Error();

            const customerDto: CustomerDto = await this.customerService.getById(userDto.customerId);
            if(customerDto == null) throw new Error();

            const addressDto: AddressDto = await this.addressService.getById(customerDto.addressId); 

            if(profile.newPassword != null && profile.oldPassword != null && profile.confirmPassword != null)
            {
                var isValidOld: boolean = this.comparePasswords(userDto.userName, profile.oldPassword, userDto.password);
                if(isValidOld == false) throw new Error("Nu poate fi schimbata parola. Introduceti o parola valida!");
                if(profile.newPassword != profile.confirmPassword) throw new Error("Nu poate fi schimbata parola. Introduceti o parola valida!");

                userDto.password = this.hashPassword(profile.newPassword, userDto.userName);
            }

            userDto.email = profile.email; 

            const customer: CustomerDto = new CustomerDto();
            customer.id = customerDto.id;
            customer.details = profile.details;
            customer.email = profile.email;
            customer.gender = profile.gender;
            customer.name = profile.firstName;
            customer.surname = profile.lastName;
            customer.phoneNo = profile.phoneNo;

            const address: AddressDto = new AddressDto();
            address.id = addressDto == null ? 0 : addressDto.id;
            address.city = profile.city;
            address.details = profile.addressDetail;
            address.zipCode = profile.postalCode;

            await this.userService.update(userDto);
            await this.customerService.update(customer);
            await this.addressService.update(address);

        }
        catch(err)
        {
            console.log(err);
            throw err;
        }
        return await this.myProfile(profile.userId);
    }
 
    public async login({ userName, password } : Credentials): Promise<UserLiteDto>
    {
        const user: UserDto = await this.userService.findActiveOne(userName); 

        let compareResult: boolean = this.comparePasswords(userName, password , user.password);
        if (!isNullOrUndefined(user) && compareResult == true)
            return await this.getLiteInfo(user);
        let ret: UserLiteDto = new UserLiteDto();
        ret.success = false;
        return ret;
    }

    public async register(user: RegisterUserDto)
    {
        if(user.password != user.confirmPassword)
            throw new Error();

        const { userName } = user;
        let appUser: UserDto =  await this.userService.findOne(userName);
        if(!isNullOrUndefined(appUser))
            throw new Error();
        
        user.password = this.hashPassword(user.password, user.userName);
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
        let info: UserLiteDto = new UserLiteDto();
        try
        {
            info = this.mapper.map(user, UserLiteDto, UserDto);
            const customer: CustomerDto = await this.customerService.getById(user.customerId);
            if(customer == null)
                throw new Error();
             
            info.firstName = customer.name;
            info.lastName = customer.surname; 

            info.token = await this.jwtService.signAsync({ user: info }, { expiresIn: "5d" });
            info.success = true;
        }
        catch(error)
        {
            ExceptionHandler.Log(error);
            info = new UserLiteDto();
            info.success = false;
        }

        return info;
    }


    public hashPassword(password: string, username: string): string
    {
        const hash: string = Md5.hashStr(password).toString() + Md5.hashStr(username).toString();
        return hash;
    }

    public comparePasswords(username: string, password: string, passwordHash: string): boolean
    {
        const chckHash: string = this.hashPassword(password, username);
        return passwordHash == chckHash;
    }
    
}
