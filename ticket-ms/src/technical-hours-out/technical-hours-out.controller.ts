import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TechnicalHoursOutService } from './technical-hours-out.service';
import { CreateTechnicalHoursOutDto } from './dto/create-technical-hours-out.dto';
import { UpdateTechnicalHoursOutDto } from './dto/update-technical-hours-out.dto';

/**
 * Controller for managing technical hours out of service.
 * This controller handles messages and delegates business logic to the `TechnicalHoursOutService`.
 */
@Controller()
export class TechnicalHoursOutController 
{

  /**
   * Constructor of the controller.
   * Injects the `TechnicalHoursOutService` to delegate business logic.
   * 
   * @param technicalHoursOutService The service to handle technical hours out of service.
   */
  constructor(private readonly technicalHoursOutService: TechnicalHoursOutService) {}

  /**
   * Handles the message to create a new technical hours out of service record.
   * 
   * @param createTechnicalHoursOutDto The DTO containing the data to create a new technical hours out record.
   * @returns The result of the record creation, delegated to the `create` service method.
   */
  @MessagePattern('createTechnicalHoursOut')
  create(@Payload() createTechnicalHoursOutDto: CreateTechnicalHoursOutDto) 
  {
    return this.technicalHoursOutService.create(createTechnicalHoursOutDto);
  }


  /**
   * Handles the message to retrieve all technical hours out of service records.
   * 
   * @returns All technical hours out records, delegated to the `findAll` service method.
   */
  @MessagePattern('findAllTechnicalHoursOut')
  findAll() 
  {
    return this.technicalHoursOutService.findAll();
  }


  /**
   * Handles the message to retrieve a specific technical hours out of service record by its ID.
   * 
   * @param id The ID of the technical hours out record to retrieve.
   * @returns The technical hours out record corresponding to the ID, delegated to the `findOne` service method.
   */
  @MessagePattern('findOneTechnicalHoursOut')
  findOne(@Payload() id: string) 
  {
    return this.technicalHoursOutService.findOne(id);
  }


  /**
   * Handles the message to update an existing technical hours out of service record.
   * 
   * @param updateTechnicalHoursOutDto The DTO containing the data to update an existing record.
   * @returns The result of the update, delegated to the `update` service method.
   */
  @MessagePattern('updateTechnicalHoursOut')
  update(@Payload() updateTechnicalHoursOutDto: UpdateTechnicalHoursOutDto) 
  {
    return this.technicalHoursOutService.update(updateTechnicalHoursOutDto.id, updateTechnicalHoursOutDto);
  }

  
}
