import { SelectItem } from "./selectitem";

export interface IProfile
{
    userName: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    branch: string;
    branchName: string;
    gender: string;

    genderDropDown: SelectItem<string, string> [];

    details: string;

    city?: string;
    postalCode?: string;

    addressDetail?: string;
}

export class Profile implements IProfile
{
    userId!: number;
    branchName: string;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    branch: string;
    gender: string;
    genderDropDown: SelectItem<string, string>[];
    details: string;
    city?: string;
    postalCode?: string;
    addressDetail?: string;

    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}