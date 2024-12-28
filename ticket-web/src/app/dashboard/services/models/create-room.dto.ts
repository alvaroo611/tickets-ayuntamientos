import { IsString, IsNotEmpty, IsNumber, IsUUID, IsOptional, IsBoolean } from 'class-validator';

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
    staffNumber: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNotEmpty()
    departmentId: string;

    constructor(
        building: string,
        office: number,
        floor: number,
        staffNumber: number,
        departmentId: string,
        isActive?: boolean
    ) {
        this.building = building;
        this.office = office;
        this.floor = floor;
        this.staffNumber = staffNumber;
        this.departmentId = departmentId;
        this.isActive = isActive;
    }
}
