import { IsMobilePhone, IsString, Length } from "class-validator";

export class sendOtpDto {
    @IsMobilePhone("fa-IR", {}, {message: "mobile is Invalid !"})
    mobile: string;
}


export class checkOtpDto {
    @IsMobilePhone("fa-IR", {}, {message: "mobile is Invalid !"})
    mobile: string;
    @IsString()
    @Length(5, 5, {message: "code is wrong !"})
    code: string;
}