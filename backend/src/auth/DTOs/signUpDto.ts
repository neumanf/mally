import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(3, 30)
    name: string;

    @IsString()
    @Length(8, 100)
    password: string;
}
