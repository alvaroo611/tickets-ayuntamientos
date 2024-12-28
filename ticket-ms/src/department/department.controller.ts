import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DepartamentoService } from './department.service';
import { CreateDepartmentDto  } from './dto/create-department.dto';
import { UpdateDepartamentoDto } from './dto/update-department.dto';


/**
 * Controller responsible for handling department-related microservice requests.
 * 
 * This controller handles various department operations such as creating, updating, finding, and removing departments,
 * as well as retrieving department appointments for a specific date.
 */

@Controller()
export class DepartamentoController 
{
  /**
 * Initializes the `DepartamentoController` with the `DepartamentoService` to handle department-related operations.
 * 
 * @param departamentoService - The service used to interact with department data.
 */

  constructor(private readonly departamentoService: DepartamentoService) {}

  /**
 * Retrieves appointments by department for a given date.
 * 
 * @param data - An object containing the department ID and the date to fetch appointments for.
 * @param data.id - The ID of the department.
 * @param data.date - The date of the appointments to retrieve.
 * @return Promise<any> - Returns available time slots and related tickets for the specified department and date.
 */

  @MessagePattern('getAppointmentsByDepartment')
  async getAppointmentsByDepartment(
    @Payload() data: { id: string, date: string }
  ) 
  {
    return this.departamentoService.getAppointmentsByDepartment(data.id, data.date);
  }
 
  /**
 * Creates a new department based on the provided data.
 * 
 * @param createDepartamentoDto - The DTO containing the data to create a new department.
 * @return Promise<{ message: string }> - Returns a success message after the department has been created.
 */

  @MessagePattern('createDepartment')
  create(@Payload() createDepartamentoDto: CreateDepartmentDto ) 
  {
    return this.departamentoService.create(createDepartamentoDto);
  }

  /**
   * Retrieves all departments from the service.
   * 
   * @return Promise<Department[]> - Returns a list of all departments with their related city councils.
   */

  @MessagePattern('findAllDepartment')
  findAll() 
  {
    return this.departamentoService.findAll();
  }

  /**
   * Retrieves all active departments from the service.
   * 
   * @return Promise<Department[]> - Returns a list of active departments with their related city councils.
   */

  @MessagePattern('findAllActiveDepartment')
  findAllActive() 
  {
    
    return this.departamentoService.findAllActive();
  }

  /**
   * Retrieves all inactive departments from the service.
   * 
   * @return Promise<Department[]> - Returns a list of inactive departments with their related city councils.
   */

  @MessagePattern('findAllInactiveDepartment')
  findAllInactive() 
  {
    
    return this.departamentoService.findAllInactive();
  }

  /**
   * Retrieves a single department by its ID.
   * 
   * @param departmentId - The ID of the department to fetch.
   * @return Promise<Department> - Returns the department details for the specified department ID.
   */

  @MessagePattern('findOneDepartment')
  findOne(@Payload() departmentId: string) 
  {
    return this.departamentoService.findOne(departmentId);
  }


  /**
   * Updates an existing department based on the provided data.
   * 
   * @param updateDepartamentoDto - The DTO containing the department ID and updated data.
   * @param updateDepartamentoDto.departmentId - The ID of the department to update.
   * @param updateDepartamentoDto - The updated department data.
   * @return Promise<{ message: string }> - Returns a success message after the department has been updated.
   */

  @MessagePattern('updateDepartment')
  update(@Payload() updateDepartamentoDto: UpdateDepartamentoDto)
  {
    return this.departamentoService.update(updateDepartamentoDto.departmentId, updateDepartamentoDto);
  }
  
  /**
   * Removes (deactivates) a department based on its name.
   * 
   * @param nom_depart - The name of the department to deactivate.
   * @return Promise<string> - Returns a success message if the department has been deactivated.
   */

  @MessagePattern('removeDepartment')
  remove(@Payload() nom_depart: string)
  {
    return this.departamentoService.remove(nom_depart);
  }
}
