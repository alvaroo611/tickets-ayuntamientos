import { IsString, IsNotEmpty, IsNumber, IsUUID, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
    
    

    @IsString()
    @IsNotEmpty()
    building: string;

    @IsNumber()
    @IsNotEmpty()
    office: number;

    @IsNumber()
    @IsNotEmpty()
    floor: number;
    
    @IsNumber()
    @IsNotEmpty()
    staffNumber:number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean ;
    

    @IsNotEmpty()
    departmentId: string; 
}
