import { IsString, IsNotEmpty, Length, IsUUID, IsOptional, IsBoolean } from "class-validator";

export class CreateDepartmentDto 
{

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
  isActive?: boolean ;
  
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean ;
  
  @IsNotEmpty()
  @IsUUID()
  cityHallId: string; 
}
