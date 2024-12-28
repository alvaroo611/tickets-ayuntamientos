import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "../../../login/auth.service";
import { RoomFormCreateComponent } from "./room-form-create/room-form-create.component";
import { RoomFormUpdateComponent } from "./room-form-update/room-form-update.component";
import { RoomService } from "../../services/room.service";
import { DepartmentService } from "../../services/department.service"; // Importa el servicio de departamento

@Component({
  selector: 'app-room-screen',
  templateUrl: './room-screen.component.html',
  styleUrls: ['./room-screen.component.css']
})
export class RoomsScreenComponent implements OnInit
{
  rooms: any[] = [];
  filteredRooms: any[] = [];
  dialogRefCrear: MatDialogRef<RoomFormCreateComponent> | null = null;
  dialogRefEdit: MatDialogRef<RoomFormUpdateComponent> | null = null;
  // Add arayy for room
  roomDepartmentNames: { [key: string]: string } = {};  // Usamos un objeto para mapear roomId a departmentName
  /**
   * Constructor for initializing the RoomsScreenComponent.
   * @param dialog - Service for opening dialogs.
   * @param roomService - Service for interacting with room-related API endpoints.
   * @param departmentService - Service for fetching department data.
   * @param router - Angular router for navigation.
   * @param authService - Service for authentication and user-related functions.
   * @param changeDetectorRef - Service for manually triggering change detection.
   */
  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private departmentService: DepartmentService, // Agrega el servicio de departamento
    private router: Router,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Initializes the component and fetches rooms.
   * @returns void
   */
  ngOnInit(): void
  {
    this.fetchRooms();
  }

  /**
   * Fetches rooms and their department names from the API.
   * Updates the list of rooms and assigns department names to each room.
   * @returns void
   */
  fetchRooms()
  {

    const cityCouncilId=this.authService.getCityCouncil();
    this.roomService.getRoomsByCityHall(cityCouncilId).subscribe(
      data => {
        this.rooms = data;
        this.filteredRooms = [...this.rooms];


        this.rooms.forEach(room => {

          if (room.department && room.department.departmentId) {

            if (room.department.departmentId) {
              this.departmentService.findDepartmentById(room.department.departmentId).subscribe(
                department => {

                  if (department) {
                    this.roomDepartmentNames[room.roomId] = department.departmentName || 'No asignado';


                    this.changeDetectorRef.detectChanges();
                  }
                },
                error => {
                  console.error('Error al obtener el nombre del departamento:', error);
                  this.roomDepartmentNames[room.roomId] = 'Error al obtener departamento';
                }
              );
            }
          } else {

            this.roomDepartmentNames[room.roomId] = 'No asignado';
          }
        });
      },
      error => {
        console.error('Error al obtener salas:', error);
      }
    );
  }



  /**
   * Filters the rooms based on the search query entered by the user.
   * @param event - The input event containing the search query.
   * @returns void
   */
  onSearch(event: any)
  {
    const query = event.target.value.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (query) {
      this.filteredRooms = this.rooms.filter(room => {
        const building = room.building.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(query);

        const department = this.roomDepartmentNames[room.roomId]?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(query);

        return building || department;
      });
    } else {
      this.filteredRooms = [...this.rooms];
    }
  }

  /**
   * Opens the dialog to create a new room.
   * After the room is created, it updates the room list.
   * @returns void
   */
  openCreateRoomDialog()
  {
    this.dialogRefCrear = this.dialog.open(RoomFormCreateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      panelClass: 'custom-modal'
    });


    this.dialogRefCrear.componentInstance.roomCreated.subscribe(() => {
      this.fetchRooms();
    });

    this.dialogRefCrear.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  /**
   * Opens the dialog to edit an existing room.
   * After the room is edited, it updates the room list.
   * @param room - The room to be edited.
   * @returns void
   */
  openEditRoomDialog(room: any)
  {

    this.dialogRefEdit = this.dialog.open(RoomFormUpdateComponent, {
      width: '60vw',
      maxWidth: '400px',
      minWidth: '300px',
      maxHeight: '500px',
      height: '70vh',
      panelClass: 'custom-modal',
      data: room
    });

    this.dialogRefEdit.componentInstance.roomEdit.subscribe(() => {
      this.fetchRooms();
    });

    this.dialogRefEdit.afterClosed().subscribe(result => {
      if (result) {

        this.fetchRooms();
      }
    });
  }

  /**
   * Toggles the active/inactive status of a room and updates it in the backend.
   * @param room - The room whose status will be toggled.
   * @returns void
   */
  updateRoomStatus(room: any) {
    room.isActive = !room.isActive;


    const updatedRoom: any = {
      building: room.building,
      office: room.office,
      floor: room.floor,
      isActive: room.isActive,
      departmentId: room.departmentId
    };
    

    // Update in backend
    this.roomService.updateRooms(room.idRoom, updatedRoom).subscribe(
      response => console.log('Actualización exitosa', response),
      error => console.error('Error al actualizar', error)
    );
  }
  /**
   * Closes the current tab and navigates to the admin dashboard.
   * @returns void
   */
  closeTab()
  {
    this.router.navigate(['/admin']);
  }

  /**
   * Returns the department name for a given room.
   * If the department name is not available, it returns 'Cargando...'.
   * @param roomId - The ID of the room for which the department name is needed.
   * @returns string - The department name or 'Cargando...' if not available.
   */
  getDepartmentNameForRoom(roomId: string): string {
    return this.roomDepartmentNames[roomId] || 'Cargando...';
  }
}
