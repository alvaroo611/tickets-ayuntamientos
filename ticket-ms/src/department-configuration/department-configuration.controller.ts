import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DepartmentConfigurationService } from './department-configuration.service';
import { CreateDepartmentConfigurationDto } from './dto/create-department-configuration.dto';
import { UpdateDepartmentConfigurationDto } from './dto/update-department-configuration.dto';

/**
 * Controller for handling department configuration requests.
 * This controller listens to various message patterns to handle operations like create, update, find, and delete.
 */
@Controller()
export class DepartmentConfigurationController 
{

  /**
   * Constructor for DepartmentConfigurationController.
   * 
   * @param departmentConfigurationService Service for managing department configurations.
   */
  constructor(private readonly departmentConfigurationService: DepartmentConfigurationService) {}


  /**
   * Creates a new department configuration.
   * Listens to the 'createDepartmentConfiguration' message pattern.
   * 
   * @param createDepartmentConfigurationDto DTO containing the data to create the department configuration.
   * @returns The created department configuration.
   */
  @MessagePattern('createDepartmentConfiguration')
  create(@Payload() createDepartmentConfigurationDto: CreateDepartmentConfigurationDto)
  {
    return this.departmentConfigurationService.create(createDepartmentConfigurationDto);
  }

  /**
   * Retrieves all department configurations.
   * Listens to the 'findAllDepartmentConfiguration' message pattern.
   * 
   * @returns A list of all department configurations.
   */
  @MessagePattern('findAllDepartmentConfiguration')
  findAll() 
  {
    return this.departmentConfigurationService.findAll();
  }

  /**
   * Retrieves department configurations by department ID.
   * Listens to the 'findByDepartmentId' message pattern.
   * 
   * @param departmentId The ID of the department to retrieve configurations for.
   * @returns A list of configurations for the specified department.
   */
  @MessagePattern('findByDepartmentId')
  findByDepartmentId(@Payload() departmentId: string) 
  {
    return this.departmentConfigurationService.findByDepartmentId(departmentId);
  }

  /**
   * Retrieves a specific department configuration by ID.
   * Listens to the 'findOneDepartmentConfiguration' message pattern.
   * 
   * @param id The ID of the department configuration to retrieve.
   * @returns The department configuration if found.
   */
  @MessagePattern('findOneDepartmentConfiguration')
  findOne(@Payload() id: string) 
  {
    return this.departmentConfigurationService.findOne(id);
  }


  /**
   * Updates an existing department configuration.
   * Listens to the 'updateDepartmentConfiguration' message pattern.
   * 
   * @param updateDepartmentConfigurationDto DTO containing the data to update the department configuration.
   * @returns A message indicating the success of the update.
   */
  @MessagePattern('updateDepartmentConfiguration')
  update(@Payload() updateDepartmentConfigurationDto: UpdateDepartmentConfigurationDto) 
  {
    return this.departmentConfigurationService.update(updateDepartmentConfigurationDto.id, updateDepartmentConfigurationDto);
  }
  

}
