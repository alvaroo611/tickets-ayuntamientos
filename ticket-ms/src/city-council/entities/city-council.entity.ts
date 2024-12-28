import { Employee } from "src/auth/entities/auth.entity";
import { Department } from "src/department/entities/department.entity";

import { Ticket } from "src/ticket/entities/ticket.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

/**
 * Represents a city council within the system.
 * 
 * This entity includes essential properties and relationships 
 * to define the city council's attributes and its associations with other entities, 
 * such as `Department`, `Employee`, and `Ticket`.
 */
@Entity()
export class CityCouncil 
{
  /**
   * Unique identifier for the city council (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The name of the city council.
   * @type {string}
   */
  @Column()
  name: string;
  
   /**
   * Indicates whether the city council is active or deactivated.
   * Defaults to `true` when a new city council is created.
   * @type {boolean}
   */
  @Column({ default: true })
  isActive: boolean;
  
  /**
   * One-to-Many relationship with `Department`.
   * Represents the departments within the city council.
   * @type {Department[]}
   */
  @OneToMany(() => Department, (departamento) => departamento.cityCouncil)
  departments: Department[];

  /**
   * One-to-Many relationship with `Employee`.
   * Represents the employees working for the city council.
   * @type {Employee[]}
   */
  @OneToMany(() => Employee, (empleado) => empleado.DNI)
  employees: Employee[];

  /**
   * One-to-Many relationship with `Ticket`.
   * Represents the tickets associated with the city council.
   * @type {Ticket[]}
   */
  @OneToMany(() => Ticket, (ticket) => ticket.id_ticket)
  tickets: Ticket[];
  
}
