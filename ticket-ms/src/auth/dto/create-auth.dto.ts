import { IsNotEmpty, IsString, IsIn, IsOptional, Length, Matches, IsUUID, IsBoolean } from 'class-validator';


export class CreateAuthDto 
{
  @IsNotEmpty()
  @IsString()
  @Length(9, 9) // Longitud de 9 caracteres
  @Matches(/^\d{8}[A-Za-z]$/, { message: 'DNI must be 8 digits followed by a letter' }) // Formato: 8 dígitos y 1 letra
  DNI: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'tec', 'responsable']) // Los roles permitidos
  rol: string;

  
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean ;
  
  @IsNotEmpty()
  @IsUUID()
  cityCouncilId: string;

  
  @IsNotEmpty()
  @IsUUID()
  department_id: string;
  
}
