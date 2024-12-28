import { Employee } from "src/auth/entities/auth.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";

/**
 * Represents the technical hours an employee spends outside of their normal technical tasks.
 * 
 * This entity tracks the start and end time of the employee's absence, the reason for the absence, 
 * and the active status of the absence record. It also manages the relationship between the employee 
 * and their time outside technical tasks.
 */
@Entity('tecnico_horas_fuera')
export class TechnicalHoursOut 
{

  /**
   * Unique identifier for the technical hours record (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The start date and time of the employee's absence from technical tasks.
   * @type {Date}
   */
  @Column({ type: 'datetime' })
  fechaInicioSalida: Date;

  /**
   * The end date and time of the employee's absence from technical tasks.
   * @type {Date}
   */
  @Column({ type: 'datetime' })
  fechaFinSalida: Date;

  /**
   * The reason for the employee's absence from technical tasks.
   * @type {string}
   */
  @Column()
  motivo: string;

  /**
   * Indicates whether the record is active or not.
   * Defaults to `true` when the record is created.
   * @type {boolean}
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Many-to-One relationship with `Employee`.
   * Represents the employee who is associated with the technical hours out record.
   * @type {Employee}
   */
  @ManyToOne(() => Employee, (employee) => employee.technicalHoursOuts)
  @JoinColumn()
  employee: Employee;
}
