import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmpleadoSalaService } from './employee-room.service';
import { CreateEmployeeRoomDto  } from './dto/create-employee-room.dto';
import { UpdateEmployeeRoomDto } from './dto/update-employee-room.dto';


/**
 * EmpleadoSalaController handles incoming messages related to employee-room assignments.
 * It listens to message patterns and delegates the requests to the EmpleadoSalaService.
 * The available actions are:
 * 1. `createEmpleadoSala`: Creates a new employee-room assignment.
 * 2. `findAllEmpleadoSala`: Retrieves all employee-room assignments.
 * 3. `findAllActiveEmpleadoSala`: Retrieves all active employee-room assignments.
 * 4. `findAllInactiveEmpleadoSala`: Retrieves all inactive employee-room assignments.
 * 5. `findOneEmpleadoSala`: Retrieves a specific employee-room assignment by its ID.
 * 6. `updateEmpleadoSala`: Updates an existing employee-room assignment.
 * 7. `removeEmpleadoSala`: Deactivates an employee-room assignment.
 * 
 * This controller uses the `EmpleadoSalaService` to process the logic for each operation.
 */
@Controller()
export class EmpleadoSalaController 
{
  constructor(private readonly empleadoSalaService: EmpleadoSalaService) {}


  /**
   * Creates a new employee-room assignment.
   * - Checks if the employee and room exist.
   * - Validates that the end date is not earlier than the start date.
   * - Verifies that there are no overlapping assignments for the employee in the specified date range.
   * - Saves the new assignment if all validations pass.
   * 
   * @param createEmpleadoSalaDto - The DTO containing data to create the new assignment.
   * @returns - A success message or throws RpcException if any validation fails.
   */
  @MessagePattern('createEmpleadoSala')
  create(@Payload() createEmpleadoSalaDto ) {

    const dto = Object.assign(createEmpleadoSalaDto, {
   
      startDate: new Date(createEmpleadoSalaDto.startDate),
      endDate: new Date(createEmpleadoSalaDto.endDate),
    })

    return this.empleadoSalaService.create(dto);
  }

  /**
   * Retrieves all employee-room assignments.
   * - Fetches all records with their associated rooms and employees.
   * 
   * @returns - A list of all employee-room assignments.
   */
  @MessagePattern('findAllEmpleadoSala')
  findAll() {
    return this.empleadoSalaService.findAll();
  }

  /**
   * Retrieves all active employee-room assignments.
   * - Fetches assignments where the `isActive` field is set to true.
   * 
   * @returns - A list of active employee-room assignments.
   */
  @MessagePattern('findAllActiveEmpleadoSala')
  findAllActive() 
  {
    
    return this.empleadoSalaService.findAllActive();
  }

  /**
   * Retrieves all inactive employee-room assignments.
   * - Fetches assignments where the `isActive` field is set to false.
   * 
   * @returns - A list of inactive employee-room assignments.
   */
  @MessagePattern('findAllInactiveEmpleadoSala')
  findAllInactive() 
  {
    
    return this.empleadoSalaService.findAllInactive();
  }

  /**
   * Retrieves a specific employee-room assignment by its ID.
   * - Fetches the assignment with the specified ID and includes related room and employee information.
   * - Throws an exception if the assignment is not found.
   * 
   * @param id - The ID of the employee-room assignment.
   * @returns - The employee-room assignment details.
   */
  @MessagePattern('findOneEmpleadoSala')
  findOne(@Payload() id: string) {
    return this.empleadoSalaService.findOne(id);
  }


  /**
   * Updates an existing employee-room assignment.
   * - Validates that the room and employee exist.
   * - Ensures there are no date overlaps with other assignments.
   * - Preloads the existing assignment, applies updates, and saves the changes.
   * 
   * @param id - The ID of the assignment to update.
   * @param updateEmpleadoSalaDto - The DTO with updated data.
   * @returns - A success message and the updated assignment data.
   */
  @MessagePattern('updateEmpleadoSala')
  update(@Payload() updateEmpleadoSalaDto: UpdateEmployeeRoomDto) {
    return this.empleadoSalaService.update(updateEmpleadoSalaDto.id, updateEmpleadoSalaDto);
  }


    /**
   * Deactivates an employee-room assignment by setting the `isActive` field to false.
   * - Throws an exception if the assignment is already deactivated.
   * 
   * @param id - The ID of the employee-room assignment to deactivate.
   * @returns - A success message indicating the assignment was deactivated.
   */
  @MessagePattern('removeEmpleadoSala')
  remove(@Payload() id: string) {
    return this.empleadoSalaService.remove(id);
  }
}
