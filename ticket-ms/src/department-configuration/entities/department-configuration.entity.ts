import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Department } from "src/department/entities/department.entity";
/**
 * Represents the configuration settings for a department within the system.
 * 
 * This entity includes the department's working hours configuration and its association 
 * with a specific department via a one-to-one relationship.
 */
@Entity()
export class DepartmentConfiguration {
  
  /**
   * Unique identifier for the department configuration (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * The start time for the department's working hours.
   * @type {Date}
   */
  @Column({ type: 'timestamp' }) 
  horaInicio: Date;

  /**
   * The end time for the department's working hours.
   * @type {Date}
   */
  @Column({ type: 'timestamp' }) 
  horaFinal: Date;

  /**
   * The interval (in minutes) between appointments or actions within the department.
   * @type {number}
   */
  @Column()
  intervalo: number;

  /**
   * One-to-One relationship with `Department`.
   * Represents the department associated with this configuration.
   * @type {Department}
   */
  @OneToOne(() => Department)
  @JoinColumn()
  department: Department;
}
