import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityCouncilDto  } from './dto/create-city-council.dto';
import { UpdateAyuntamientoDto } from './dto/update-city-council.dto';
import { CityCouncil } from './entities/city-council.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Department } from 'src/department/entities/department.entity';

/**
 * Service for managing city councils and related operations.
 * Handles CRUD operations, including creation, update, removal, and retrieval of city councils.
 * It also manages the creation of departments related to city councils.
 */
@Injectable()
export class AyuntamientoService {

  /**
   * Constructor for the City Council service.
   * 
   * @param ayuntamientoRepository Repository for city council operations.
   * @param departmentRepository Repository for department operations.
   */
  constructor(
    @InjectRepository(CityCouncil) 
    private ayuntamientoRepository: Repository<CityCouncil>,
    @InjectRepository(Department) 
    private departmentRepository: Repository<Department>,
  ) {}

  /**
   * Creates a new city council and an "Administrators" department for the city council.
   * 
   * @param createAyuntamientoDto DTO containing city council data for creation.
   * @returns A success message or throws an error if creation fails.
   */
  async create(createAyuntamientoDto: CreateCityCouncilDto ) {
    
    try 
    {
      // Verificar si ya existe un registro con el mismo nombre
      const existingAyuntamiento = await this.ayuntamientoRepository.findOne({
        where: { name: createAyuntamientoDto.name },
      });
  
      if (existingAyuntamiento) 
      {
        throw new RpcException({message:'The record with the same name already exists in the database',status: HttpStatus.CONFLICT});
      }
     
      const authEntity = this.ayuntamientoRepository.create(createAyuntamientoDto);
      await this.ayuntamientoRepository.save(authEntity);
      
      const adminDepartment =this.departmentRepository.create({
        departmentName: "Administradores",
        description: "Departamento encargado de la administración y gestión general de la web.",
        responsible: "unassigned",
        isAdmin: true,
        cityCouncil:authEntity
      }
      );
      await this.departmentRepository.save(adminDepartment);
      
      return {message:'City Hall created successfully.'};
  
    } 
    catch (error)
    {
      
      throw new RpcException(
        {message:`Unexpected error creating record: ${error.message}.`,
        status:HttpStatus.INTERNAL_SERVER_ERROR,}
      );
    }
  }


  /**
   * Retrieves all city councils.
   * 
   * @returns A list of all city councils.
   */
  findAll() {
    return this.ayuntamientoRepository.find();
  }


  /**
   * Retrieves all active city councils.
   * 
   * @returns A list of active city councils.
   */
  async findAllActive() {
    return this.ayuntamientoRepository.find({
      where: { isActive: true },  
    });
  }

  /**
   * Retrieves all inactive city councils.
   * 
   * @returns A list of inactive city councils.
   */
  async findAllInactive(){
    return this.ayuntamientoRepository.find({
      where: { isActive: false },  
    });
  }

  /**
   * Retrieves a specific city council by its ID.
   * 
   * @param id The ID of the city council to find.
   * @returns The city council if found, or throws a "Not Found" exception if not.
   */
  async findOne(id: string) {
    const ayuntamiento = await this.ayuntamientoRepository.findOne({
      where: {id},
    });
    if(!ayuntamiento)
    {
      throw new RpcException({message:'City council not found.',status:HttpStatus.NOT_FOUND});
    }
    return ayuntamiento;
  }


  /**
   * Updates a city council by its ID.
   * 
   * @param id The ID of the city council to update.
   * @param updateAyuntamientoDto DTO containing updated city council data.
   * @returns The updated city council.
   */
  async update(id: string, updateAyuntamientoDto: UpdateAyuntamientoDto) {
    const ayuntamiento = await this.ayuntamientoRepository.preload({
      id,
      ...updateAyuntamientoDto
    });
    if(!ayuntamiento)
    {
      throw new RpcException({message:'City council not found.',status:HttpStatus.NOT_FOUND});
    }
    this.ayuntamientoRepository.save(ayuntamiento);
    return ayuntamiento;
  }


  /**
   * Deactivates a city council by its ID.
   * 
   * @param id The ID of the city council to deactivate.
   * @returns A success message or throws an error if the city council is already deactivated.
   */
  async remove(id: string) {
    const cityCouncil = await this.findOne(id);
    
    if(cityCouncil.isActive == false )
    {
      throw new RpcException({message:`The city council is already deactivated`,statusCode: HttpStatus.CONFLICT});
    } 
    else
    {
      cityCouncil.isActive = false; 
      await this.ayuntamientoRepository.save(cityCouncil); 
     
    } 
   
  
    return  "City council deactivated successfully."; 
  }
}  
