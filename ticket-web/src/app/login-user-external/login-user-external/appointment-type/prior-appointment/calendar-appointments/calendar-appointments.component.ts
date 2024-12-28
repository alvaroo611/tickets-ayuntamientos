import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../../../dashboard/services/department.service';
import { AppointmentHoursComponent } from './appointment-hours/appointment-hours.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedDataService } from '../../../../services/shared-data.service';

@Component({
  selector: 'app-calendar-appointments',
  templateUrl: './calendar-appointments.component.html',
  styleUrls: ['./calendar-appointments.component.css']
})
export class CalendarAppointmentsComponent
{
  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  intervals: any[] = []; // Intervalos disponibles
  selectedDate: Date | null = null;
  departmentId: string = ''; // ID del departamento (dinámico en el futuro)

  constructor(
    private cdr: ChangeDetectorRef,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private sharedDataService: SharedDataService
  ) {}


  /**
   * Lifecycle method executed when the component initializes.
   * Updates the calendar to show the current month.
   */
  ngOnInit(): void
  {

    this.updateCalendar();
  }


  /**
   * Navigates back to the previous page.
   */
  goBack(): void
  {
    this.router.navigate(['/prior-appointment'])// Reemplaza '/previous-route' con la ruta a la que quieras volver
  }


   /**
   * Retrieves all days in the current month.
   * @param date The reference date.
   * @returns An array of dates representing the days in the month.
   */
   getDaysInMonth(date: Date): Date[] {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Determina el primer día de la semana del mes (0 = Domingo, 1 = Lunes, ...)
    const firstDayOfMonth = startDate.getDay();

    // Calcula el desplazamiento necesario para que el primer día de la semana sea lunes
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;  // Si es domingo (0), se desplaza 6 días atrás

    // Ajustamos el primer día visible
    const days: Date[] = [];
    const prevMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); // Último día del mes anterior
    const totalDays = startDate.getDate() + endDate.getDate(); // Cantidad total de días

    // Agregar días del mes anterior
    for (let i = prevMonthDays - offset + 1; i <= prevMonthDays; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth() - 1, i));
    }

    // Agregar días del mes actual
    for (let i = 1; i <= endDate.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  }



  /**
   * Handles date selection and fetches available appointments for the selected date.
   * @param date The selected date.
   */
  selectDate(date: Date): void
  {
    console.log(date)
    this.departmentId=this.sharedDataService.getDepartment().departmentId;
    this.selectedDate = date;
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    this.departmentService.getAppointmentsByDate(this.departmentId, formattedDate).subscribe(appointments => {
      const now = new Date(); // Obtiene la fecha y hora actuales
      this.intervals = appointments.filter((interval: any) => {
        const startTime = new Date(interval.start_time); // Convierte start_time a objeto Date
        return interval.tickets_count === '0' && startTime > now; // Filtra los intervalos válidos
      });
      console.log(this.intervals)
      this.updateUniqueEndTimes();
      if(this.intervals.length>0){
        this.openDialog();
      }else {
        this.openSnackBar('No hay citas disponibles para esta fecha.', 'Cerrar');
      }

      this.cdr.detectChanges();
    });
  }

  /**
   * Displays a snackbar notification with a message.
   * @param message The message to display.
   * @param action The label for the snackbar action button.
   */
  openSnackBar(message: string, action: string): void
  {
    this.snackBar.open(message, action, {
      duration: 3000,  // Duración en milisegundos (3 segundos)
      horizontalPosition: 'center',  // Posición horizontal
      verticalPosition: 'top',  // Posición vertical
      panelClass: ['snackbar-custom']  // Clase personalizada opcional
    });
  }


  /**
   * Opens a dialog to display available appointment intervals.
   */
  openDialog(): void
  {
    const dialogRef = this.dialog.open(AppointmentHoursComponent, {
      width: '30vw',
      height: 'auto',
      panelClass: 'custom-dialog',
      data: { intervals: this.intervals } // Pasa los intervalos al dialog
    });
    dialogRef.componentInstance.appointmentCreated.subscribe(() => {
      dialogRef.close();
      if (this.selectedDate) {

      }
    });
  }


  /**
   * Randomly shuffles an array.
   * @param array The array to shuffle.
   * @returns The shuffled array.
   */
shuffleArray(array: any[]): any[]
{
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  /**
   * Updates unique intervals and sorts them by time.
   */
updateUniqueEndTimes(): void
{
  const uniqueEndTimesSet = new Set<string>();

  // Desordena aleatoriamente los elementos de this.intervals
  this.intervals = this.shuffleArray(this.intervals);
    this.intervals = this.intervals.filter((interval: any) => {
      const isUnique = !uniqueEndTimesSet.has(interval.end_time);
      if (isUnique) uniqueEndTimesSet.add(interval.end_time);
      return isUnique;
    });

    this.intervals.sort((a: any, b: any) => {
      try {
        const timeA = this.convertTo24HourTime(a.end_time);
        const timeB = this.convertTo24HourTime(b.end_time);
        return timeA.getTime() - timeB.getTime();
      } catch (error) {
        console.error('Error ordenando los intervalos:', error);
        return 0; // Mantén el orden en caso de error
      }
    });

    console.log('Intervalos únicos y ordenados:', this.intervals);
  }

  /**
   * Converts 12-hour (AM/PM) time format to 24-hour format.
   * @param time The time string to convert.
   * @returns A Date object representing the time.
   */
  convertTo24HourTime(time: string): Date
  {


    // Verifica si el formato incluye fecha y hora
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(time)) {
      // Convierte directamente a un objeto Date
      const date = new Date(time);
      if (isNaN(date.getTime())) {
        throw new Error(`Formato de hora no válido: ${time}`);
      }

      return date;
    }

    // Verifica si el formato es AM/PM
    if (/^\d{1,2}:\d{2} (AM|PM)$/i.test(time)) {
      const [hours, minutes, period] = time.split(/[: ]/);
      let hour24 = parseInt(hours);



      if (period.toLowerCase() === 'pm' && hour24 !== 12) {
        hour24 += 12; // Convierte a 24 horas
      } else if (period.toLowerCase() === 'am' && hour24 === 12) {
        hour24 = 0; // 12 AM es medianoche, debe ser 00
      }

      const formattedTime = `${hour24.toString().padStart(2, '0')}:${minutes}`;


      const date = new Date(`1970-01-01T${formattedTime}:00`);

      return date;
    }

    // Verifica si el formato es directamente HH:mm
    if (/^\d{2}:\d{2}$/.test(time)) {
      const date = new Date(`1970-01-01T${time}:00`);


      return date;
    }

    // Si no coincide con ningún formato válido, lanza un error
    throw new Error(`Formato de hora no válido: ${time}`);
  }


  /**
   * Switches to the next month in the calendar.
   */
  nextMonth(): void
  {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    this.updateCalendar();
  }

  /**
   * Switches to the previous month in the calendar.
   */
  prevMonth(): void
  {
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
    this.updateCalendar();
  }

 /**
   * Updates the calendar days based on the current month.
   */
  updateCalendar(): void
  {
    this.daysInMonth = this.getDaysInMonth(this.currentDate);
    this.cdr.detectChanges();
  }
}
