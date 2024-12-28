import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AyuntamientoService } from './city-council.service';
import { CreateCityCouncilDto  } from './dto/create-city-council.dto';
import { UpdateAyuntamientoDto } from './dto/update-city-council.dto';

/**
 * Controller for handling city council operations.
 * This controller listens for specific messages (via MessagePattern) and interacts with the AyuntamientoService
 * to perform CRUD operations related to city councils.
 */
@Controller()
export class AyuntamientoController
 {

  /**
   * Constructor for the AyuntamientoController.
   * 
   * @param ayuntamientoService The service responsible for handling city council operations.
   */
  constructor(private readonly ayuntamientoService: AyuntamientoService) {}

  /**
   * Creates a new city council.
   * This method listens for the 'createCityCouncil' message and calls the create method in the service.
   * 
   * @param createAyuntamientoDto DTO containing data to create a new city council.
   * @returns A success message from the service.
   */
  @MessagePattern('createCityCouncil')
  create(@Payload() createAyuntamientoDto: CreateCityCouncilDto ) 
  {
    return this.ayuntamientoService.create(createAyuntamientoDto);
  }

  /**
   * Retrieves all city councils.
   * This method listens for the 'findAllCityCouncil' message and calls the findAll method in the service.
   * 
   * @returns A list of all city councils.
   */
  @MessagePattern('findAllCityCouncil')
  findAll() 
  {
    return this.ayuntamientoService.findAll();
  }

  /**
   * Retrieves all active city councils.
   * This method listens for the 'findAllActiveCityCouncil' message and calls the findAllActive method in the service.
   * 
   * @returns A list of all active city councils.
   */
  @MessagePattern('findAllActiveCityCouncil')
  findAllActive() 
  {
    
    return this.ayuntamientoService.findAllActive();
  }

  /**
   * Retrieves all inactive city councils.
   * This method listens for the 'findAllInactiveCityCouncil' message and calls the findAllInactive method in the service.
   * 
   * @returns A list of all inactive city councils.
   */
  @MessagePattern('findAllInactiveCityCouncil')
  findAllInactive() 
  {
    
    return this.ayuntamientoService.findAllInactive();
  }

  /**
   * Retrieves a specific city council by ID.
   * This method listens for the 'findOneCityCouncil' message and calls the findOne method in the service.
   * 
   * @param id The ID of the city council to retrieve.
   * @returns The city council if found, or an error if not found.
   */
  @MessagePattern('findOneCityCouncil')
  findOne(@Payload() id: string) 
  {
    return this.ayuntamientoService.findOne(id);
  }

  /**
   * Updates an existing city council.
   * This method listens for the 'updateCityCouncil' message and calls the update method in the service.
   * 
   * @param updateAyuntamientoDto DTO containing the data to update the city council.
   * @returns The updated city council.
   */
  @MessagePattern('updateCityCouncil')
  update(@Payload() updateAyuntamientoDto: UpdateAyuntamientoDto)
   {
    return this.ayuntamientoService.update(updateAyuntamientoDto.id, updateAyuntamientoDto);
  }

  /**
   * Deactivates a city council.
   * This method listens for the 'removeCityCouncil' message and calls the remove method in the service.
   * 
   * @param id The ID of the city council to deactivate.
   * @returns A success message if deactivation is successful.
   */
  @MessagePattern('removeCityCouncil')
  remove(@Payload() id: string)
   {
    return this.ayuntamientoService.remove(id);
  }
}
