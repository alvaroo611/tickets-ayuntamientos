import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCityCouncilDto  {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean ;
  
}
