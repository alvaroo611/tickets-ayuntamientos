import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateEmployeeRoomDto  {
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    endDate: Date;

    
    @IsString()
    @IsNotEmpty()
    table: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean ;
    
    @IsString()
    @IsNotEmpty()
    employeeDNI: string;
    
    @IsNotEmpty()
    roomId: string;
}
