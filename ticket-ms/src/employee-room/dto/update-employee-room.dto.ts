import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeRoomDto  } from './create-employee-room.dto';

export class UpdateEmployeeRoomDto extends PartialType(CreateEmployeeRoomDto ) {
  id: string;
}
