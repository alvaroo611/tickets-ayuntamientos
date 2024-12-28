import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TechnicalHoursOutService } from '../../services/technical-hours-out.service';
import { AuthService } from '../../../login/auth.service';
import { CreateAssignHoursOutComponent } from './create-assign-hours-out/create-assign-hours-out.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAssignHoursOutComponent } from './update-assign-hours-out/update-assign-hours-out.component';


@Component({
  selector: 'app-assign-hours-out',
  templateUrl: './assign-hours-out.component.html',
  styleUrls: ['./assign-hours-out.component.css'],
})
export class AssignHoursOutComponent implements OnInit
{
  filteredHourAssignments: any[] = [];
  allAssignments: any[] = [];


  /**
   * Constructor del componente AssignHoursOut
   * @param router Servicio de navegación para redirigir entre pantallas
   * @param technicalHoursOutService Servicio para gestionar asignaciones de horas fuera
   * @param authService Servicio para obtener información del usuario autenticado
   * @param dialog Servicio para manejar diálogos modales
   * @param snackBar Servicio para mostrar mensajes emergentes (snack bars)
   */
  constructor(
    private router: Router,
    private technicalHoursOutService: TechnicalHoursOutService,
    private authService:AuthService,
    private dialog: MatDialog,
    private snackBar:MatSnackBar,
  ) {}

  /**
   * Método que se ejecuta cuando se inicializa el componente
   * Carga las asignaciones de horas fuera al iniciar la pantalla
   */
  ngOnInit(): void
  {
    this.loadAssignments();
  }

  /**
   * Carga las asignaciones desde el servicio
   * Filtra las asignaciones por el departamento del usuario autenticado
   */
  loadAssignments(): void
  {
    const departmentResponsable=this.authService.getDepartmentResponsable();
    this.technicalHoursOutService.findAll().subscribe(
      (data) => {



        this.allAssignments = data.filter(assign=>assign.employee.department.departmentId===departmentResponsable );
        this.filteredHourAssignments = [...this.allAssignments];
      },
      (error) => {
        console.error('Error al cargar las asignaciones:', error);
      }
    );
  }

  /**
   * Filtra las asignaciones basadas en el texto de búsqueda
   * @param event Evento de input
   */
  onSearch(event: any): void
  {
    const query = event.target.value.toLowerCase();
    this.filteredHourAssignments = this.allAssignments.filter(
      (assignment) =>
        assignment.technician?.name?.toLowerCase().includes(query) ||
        assignment.reason?.toLowerCase().includes(query)
    );
  }

  /**
   * Abre un diálogo para crear una nueva asignación
   */
  openCreateAssignmentDialog(): void
  {
    const dialogRef = this.dialog.open(CreateAssignHoursOutComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '470px',
      height: '70vh',
      panelClass: 'custom-modal'
    });

    dialogRef.componentInstance.hoursOutCreated.subscribe(() => {
      this.loadAssignments(); // Recargar los datos de la lista
    });
  }

  /**
   * Edita una asignación existente
   * @param assignment Asignación seleccionada
   */
  editAssignment(assignment: any): void
  {
    const dialogRef = this.dialog.open(UpdateAssignHoursOutComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '470px',
      height: '70vh',
      panelClass: 'custom-modal',
      data:assignment
    });

    dialogRef.componentInstance.hoursOutUpdated.subscribe(() => {
      this.loadAssignments(); // Recargar los datos de la lista
    });
  }


   /**
   * Actualiza el estado de la asignación (activar/desactivar)
   * @param hourAssignment Asignación que se va a actualizar
   */
  updateStatus(hourAssignment:any)
  {
    const updatedStatus = !hourAssignment.isActive;

    const updatePayload = {
      fechaInicioSalida:hourAssignment.fechaInicioSalida,
      fechaFinSalida:hourAssignment.fechaFinSalida,
      motivo:hourAssignment.motivo,
      employeeDni:hourAssignment.employee.DNI,// Incluye todas las propiedades existentes
      isActive: updatedStatus, // Actualiza el estado
    }; // Solo actualiza el estado

    this.technicalHoursOutService.update(hourAssignment.id, updatePayload).subscribe({
      next: () => {
        this.snackBar.open(
          `Assignment ${updatedStatus ? 'enabled' : 'deactivated'} successfully.`,
          'Cerrar',
          { duration: 3000 }
        );
        this.loadAssignments(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.snackBar.open('Error al actualizar el estado.', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Cierra la pestaña y redirige
   */
  closeTab(): void
  {
    this.router.navigate(['/tec']);
  }
}
