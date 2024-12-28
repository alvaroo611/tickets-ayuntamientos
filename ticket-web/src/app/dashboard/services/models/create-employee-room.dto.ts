import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmployeeRoomDto {

    startDate: string;


    endDate: string;

    @IsString()
    @IsNotEmpty()
    table: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsString()
    @IsNotEmpty()
    employeeDNI: string;

    @IsNotEmpty()
    roomId: string;

    constructor(
        startDate: string,
        endDate: string,
        table: string,
        employeeDNI: string,
        roomId: string,
        isActive?: boolean
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.table = table;
        this.employeeDNI = employeeDNI;
        this.roomId = roomId;
        this.isActive = isActive;
    }
}
