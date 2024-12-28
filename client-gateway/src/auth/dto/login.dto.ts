import { IsString, MinLength, IsNotEmpty } from "class-validator";

export class LoginDto {

    @IsNotEmpty({ message: 'DNI cannot be empty' })
    @IsString({ message: 'DNI must be a string' })
    dni: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
