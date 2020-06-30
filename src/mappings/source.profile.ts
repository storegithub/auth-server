import { AutoMapper, ProfileBase, mapFrom } from '@nartc/automapper';
import { User } from '../entities/user.entity';
import { UserDto, UserLiteDto } from '../models/user.dto';
import { Profile } from 'nestjsx-automapper'; 
import { Customer } from 'src/entities/customer.entity';
import { CustomerDto } from 'src/models/customer.dto';
import { Dictionary } from 'src/entities/dictionary.entity';
import { DictionaryDto } from 'src/models/Dictionary.dto';
import { DictionaryDetail } from 'src/entities/dictionaryDetail.entity';
import { DictionaryDetailDto } from 'src/models/dictionaryDetail.dto';
import { Address } from 'src/entities/address.entity';
import { AddressDto } from 'src/models/Address.dto';
@Profile()
export class SourceProfile extends ProfileBase  {
  constructor(mapper: AutoMapper) {
    super();

    mapper.createMap(User, UserDto)
      .forMember(d => d.id, mapFrom(s => s.id))
      .forMember(d => d.password, mapFrom(s => s.password))
      .forMember(d => d.userName, mapFrom(s => s.userName))
      .forMember(d => d.customerId, mapFrom(s => s.customerId))
      .forMember(d => d.active, mapFrom(s => s.active))
      .forMember(d => d.email, mapFrom(s => s.email)).reverseMap();

    mapper.createMap(UserDto, UserLiteDto)
      .forMember(d => d.id, mapFrom(s => s.id))
      .forMember(d => d.userName, mapFrom(s => s.userName))
      .forMember(d => d.email, mapFrom(s => s.email)); 

      mapper.createMap(Customer, CustomerDto)
      .forMember(d => d.id, mapFrom(s => s.id))
      .forMember(d => d.addressId, mapFrom(s => s.address == null ? 0 : s.address.id))
      .forMember(d => d.branchId, mapFrom(s => s.branch == null ? 0: s.branch.id))
      .forMember(d => d.branchName, mapFrom(s => s.branch == null ? 0: s.branch.details))
      .forMember(d => d.gender, mapFrom(s => s.gender))
      .forMember(d => d.name, mapFrom(s => s.name))
      .forMember(d => d.surname, mapFrom(s => s.surname))
      .forMember(d => d.createdOn, mapFrom(s => s.createdOn))
      .forMember(d => d.phoneNo, mapFrom(s => s.phoneNo))
      .forMember(d => d.email, mapFrom(s => s.email))
      .forMember(d => d.details, mapFrom(s => s.details)).reverseMap(); 

      mapper.createMap(Dictionary, DictionaryDto)
      .forMember(d => d.id, mapFrom(s => s.id))
      .forMember(d => d.name, mapFrom(s => s.name)).reverseMap(); 

      mapper.createMap(DictionaryDetail, DictionaryDetailDto)
        .forMember(d => d.id, mapFrom(s => s.id))
        .forMember(d => d.dictionaryId, mapFrom(s => s.dictionaryId))
        .forMember(d => d.name, mapFrom(s => s.name))
        .forMember(d => d.value, mapFrom(s => s.value))
        .forMember(d => d.active, mapFrom(s => s.active)).reverseMap();

        mapper.createMap(Address, AddressDto)
        .forMember(d => d.id, mapFrom(s => s.id))
        .forMember(d => d.city, mapFrom(s => s.city))
        .forMember(d => d.zipCode, mapFrom(s => s.zipCode))
        .forMember(d => d.details, mapFrom(s => s.details)).reverseMap();
    }
}