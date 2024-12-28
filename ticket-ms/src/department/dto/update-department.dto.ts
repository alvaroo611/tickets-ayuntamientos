import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto  } from './create-department.dto';

export class UpdateDepartamentoDto extends PartialType(CreateDepartmentDto ) {
    departmentId: string;
}
