import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../../dashboard/services/department.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../services/shared-data.service';


@Component({
  selector: 'app-prior-appointment',
  templateUrl: './prior-appointment.component.html',
  styleUrls: ['./prior-appointment.component.css']
})
export class PriorAppointmentComponent implements OnInit
{
  departments: { departmentName: string; description: string; responsible: string }[] = [];
  isLoading: boolean = true; // Indica si los datos están cargándose
  filteredDepartments:any=[];
  constructor(private departmentService: DepartmentService,private router:Router,private sharedDataService: SharedDataService) {}

  
   // Angular lifecycle method, executed when the component initializes
  ngOnInit(): void
  {
    this.loadActiveDepartments();
  }


  /**
   * Navigates back to the previous screen.
   */
  goBack(): void
  {
    this.router.navigate(['/type-cita'])// Reemplaza '/previous-route' con la ruta a la que quieras volver
  }

   /**
   * Handles the department search logic.
   * @param event - Search input event.
   */
  onSearch(event: any)
  {
    const query = event.target.value.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (query) {
      this.filteredDepartments = this.departments.filter(department =>
        department.departmentName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query)
      );
    } else {
      this.filteredDepartments = [...this.departments];
    }
  }

  /**
   * Loads the list of active departments using the service.
   */
  loadActiveDepartments(): void
  {
    const cityCouncilId=this.sharedDataService.getAyuntamiento();
    this.departmentService.fetchDepartmentsActive().subscribe(
      (data) => {
        console.log({data})
        // Aseguramos que solo mostramos departamentos activos
        this.departments = data.filter(department => department.isActive && !department.isAdmin && department.cityCouncil.id===cityCouncilId) ;
        this.filteredDepartments=this.departments;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los departamentos:', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Handles the selection of a department.
   * @param department - The selected department.
   */
  selectDepartment(department: { department: any }): void
  {
    console.log({departmentSelected:department})
    this.sharedDataService.setDepartment(department);
    this.router.navigate(['/calendar', department]);
    // Aquí puedes redirigir al usuario o manejar la cita seleccionada
  }
}
