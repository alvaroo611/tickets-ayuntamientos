import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CityCouncilService } from '../services/city-council..service';
import { MatDialog } from '@angular/material/dialog';
import { CityCouncilFormCreateComponent } from './city-council-form-create/city-council-form-create.component';
import { CityCouncilFormUpdateComponent } from './city-council-form-update/city-council-form-update.component';
import { Router } from '@angular/router';
import { ChanguePasswordFormComponent } from './changue-password-form/changue-password-form.component';
/**
 * DashboardSuperAdminComponent is responsible for managing the super admin dashboard view.
 * It handles loading, displaying, and filtering city councils, as well as providing functionality
 * for creating, editing, and updating city council statuses. It also manages the logout process.
 * @returns void
 */
@Component({
  selector: 'app-dashboard-super-admin',
  templateUrl: './dashboard-super-admin.component.html',
  styleUrls: ['./dashboard-super-admin.component.css']
})
export class DashboardSuperAdminComponent implements OnInit
{
  cityCouncils :any[] = [];  // Array to store city council data
  filteredCityCouncils :any[]= [];  // Se inicializa también vacío
  showLogoutMenu = false;// Flag to control the visibility of the logout menu


  /**
   * Constructor to initialize the component with the required services.
   * @param cityCouncilService CityCouncilService for fetching and updating city council data
   * @param dialog MatDialog service for opening modals
   * @param route Router service for navigation
   * @returns void
   */
  constructor(private cityCouncilService: CityCouncilService,private dialog: MatDialog,private route:Router,private changeDetectorRef: ChangeDetectorRef) { }


  /**
   * ngOnInit lifecycle hook to initialize data when the component is loaded.
   * It loads the city councils by calling the loadCityCouncils method.
   * @returns void
   */
  ngOnInit(): void
  {
    this.loadCityCouncils();  // Llamamos al servicio para cargar los ayuntamientos
  }

 /**
  * Loads the city councils from the service and assigns them to the cityCouncils array.
  * It also initializes the filteredCityCouncils array with all city councils.
  * @returns void
  */
  loadCityCouncils(): void
  {
    this.cityCouncilService.fetchCityCouncil().subscribe(
      (data) => {
        this.cityCouncils = data;  // Asignamos los datos obtenidos al array
        this.filteredCityCouncils = [...this.cityCouncils];  // Inicializamos los elementos filtrados
      },
      (error) => {
        console.error('Error loading town halls.', error);
      }
    );
  }

  /**
   * Handles the logout process by navigating to the home page and closing the logout menu.
   * @returns void
   */
  logout()
  {
    this.route.navigate(['']);

    this.showLogoutMenu = false;
  }


  changePassword() {
    const dialogRef = this.dialog.open(ChanguePasswordFormComponent, {
      width: '400px', // Ajusta el tamaño del diálogo según necesites
    });

    dialogRef.afterClosed().subscribe(result => {
      // Puedes realizar alguna acción después de que el diálogo se cierre
      console.log('El diálogo se cerró', result);
    });
  }


  /**
   * Filters the city councils based on the search input.
   * It removes accents and converts both the input and the city council name to lowercase for a case-insensitive match.
   * @param event The input event containing the search value
   * @returns void
   */
  onSearch(event: Event)
  {
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    // Función para eliminar tildes
    const removeAccents = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    this.filteredCityCouncils = this.cityCouncils.filter(cc =>
      removeAccents(cc.name.toLowerCase()).includes(removeAccents(value))
    );
  }

  /**
   * Toggles the visibility of the logout menu when triggered.
   * @returns void
   */
  toggleLogoutMenu()
  {
    this.showLogoutMenu = !this.showLogoutMenu;
  }

  /**
   * Opens the dialog to create a new city council.
   * After the dialog is closed, it reloads the city councils.
   * @returns void
   */
  openCreateCityCouncilDialog()
  {

    const dialogRef=this.dialog.open(CityCouncilFormCreateComponent, {
      width: '400px', // Ajusta el tamaño del diálogo según necesites

    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadCityCouncils();
      }
    })
  }


  /**
   * Opens the dialog to edit an existing city council.
   * It passes the city council data to the dialog for editing.
   * After the dialog is closed, it reloads the city councils.
   * @param cityCouncil The city council to be edited
   * @returns void
   */
  openEditCityCouncilDialog(cityCouncil: any)
  {
    const dialogRef = this.dialog.open(CityCouncilFormUpdateComponent, {
      width: '400px',
      data: cityCouncil
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCityCouncils();
      }})
  }

  /**
   * Toggles the status of the city council (active or inactive).
   * It sends the updated status to the server and reloads the city councils.
   * @param cityCouncil The city council whose status is to be toggled
   * @returns void
   */
  toggleCityCouncilStatus(cityCouncil: any)
  {
    const status = !cityCouncil.isActive;
    const cityCouncilPayload={
      ...cityCouncil,
      isActive:status
    }
    this.cityCouncilService.updateCityCouncil(cityCouncil.id, cityCouncilPayload).subscribe(
      response => {

        this.loadCityCouncils();
        window.location.reload();

      },
      error => {
        console.error('Error al actualizar el ayuntamiento:', error);
      }
    );
  }



  /**
   * Opens the admin configuration screen for the selected city council.
   * It passes the city council data as query parameters.
   * @param cityCouncil The city council to pass to the config screen
   * @returns void
   */
  openAdminConfigScreen(cityCouncil: any)
  {
    if (!cityCouncil) {
      console.error('El objeto cityCouncil es nulo o indefinido:', cityCouncil);
      return;
    }

    this.route.navigate(['/config-admin'], {
      queryParams: {
        id: cityCouncil.id, // Passes the city council ID as a query parameter
        name: cityCouncil.name // Passes the city council name as a query parameter
      }
    });
  }


}
