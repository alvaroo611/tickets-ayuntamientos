import { IsString, IsNotEmpty, Length, IsUUID, IsOptional, IsBoolean } from "class-validator";

export class CreateDepartmentDto {

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  departmentName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  responsible: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsNotEmpty()
  @IsUUID()
  cityHallId: string |null;

  constructor(
    departmentName: string,
    description: string,
    responsible: string,
    cityHallId: string,
    isActive?: boolean,
    isAdmin?: boolean
  ) {
    this.departmentName = departmentName;
    this.description = description;
    this.responsible = responsible;
    this.cityHallId = cityHallId;
    this.isActive = isActive;
    this.isAdmin = isAdmin;
  }
}
