import { PartialType } from '@nestjs/mapped-types';
import { CreateCityCouncilDto  } from './create-city-council.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCityCouncilDto extends PartialType(CreateCityCouncilDto ) {
    @IsString()
    @IsNotEmpty()
    id: string;
}
