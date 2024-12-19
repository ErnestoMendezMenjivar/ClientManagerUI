import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../clientes/cliente';
import { Region } from '../clientes/region';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import swal from 'sweetalert2';



export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatMomentDateModule, MatSelectModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class FormComponent implements OnInit {



  public cliente: Cliente = new Cliente()
  regiones: Region[];

  public titulo: string = "Agregar cliente";
  public titulo2: string = "Editar cliente";

  public errores: { [key: string]: string[]} = {};

  //public elseTemplate: any;

  //public errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router, private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarClient();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }


  cargarClient() {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getClienteById(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }


  create() {
    this.clienteService.create(this.cliente).subscribe(
      (response: any) => {
        this.showSuccessMessage('Cliente ' + response.nombre + ' guardado con exito!!');
        this.router.navigate(['/clientes'])
      },
      (err) => {

        if (err.status === 400) {
          this.mapBackendErrors(err.error.errors );
        } else {
          this.showErrorMessage('Ocurrio un error inesperado.');
        }
        //this.errores = err.error.errors as string[];
        console.error('codigo de error desde el back: ' + err.status);
        console.error(err.error.errors);

      }
    )
  }

  update() {
    this.clienteService.update(this.cliente).subscribe(
      (json) => {
        this.showSuccessMessageEdit(json.mensaje + " : " + json.cliente.nombre);
        this.router.navigate(['/clientes'])
      },
      (err) => {

        if(err.status === 400){
          this.mapBackendErrors(err.error.errors);
        }

        //this.errores = err.error.errors as string[];
        console.error('codigo de error desde el back: ' + err.status);
        console.error(err.error.errors);

      }
    )
  }

  regresar() {
    this.router.navigate(['/clientes']);
  }

  //Metodo de mapear errores genericos del backend a campos espeficicos
  private mapBackendErrors(errors: string[]) {
    this.errores = {};
    errors.forEach((error) => {
      if(error.includes('nombre')){
        this.errores['nombre'] = this.errores['nombre'] || [];
        this.errores['nombre'].push(error);
      }else if(error.includes('apellido')){
        this.errores['apellido'] = this.errores['apellido'] || [];
        this.errores['apellido'].push(error);
      }else if(error.includes('email')){
        this.errores['email'] = this.errores['email'] || [];
        this.errores['email'].push(error);
      }else if(error.includes('createAt')){
        this.errores['createAt'] = this.errores['createAt'] || [];
        this.errores['createAt'].push(error);
      }
    });
  }

  //Metodo para limpiar errores del backend al escribir en el input
  cleanBackendError(field: string){
    if(this.errores[field]){
      delete this.errores[field];
    }
  }

  private showSuccessMessage(message: string) {
    swal.fire({
      icon: 'success',
      title: 'Nuevo cliente',
      text: message,
      showConfirmButton: false,
      timer: 2600
    })
  }

  private showSuccessMessageEdit(message: string) {
    swal.fire({
      icon: 'info',
      title: 'Cliente Editado',
      text: message,
      showConfirmButton: false,
      timer: 2600
    })
  }

  private showErrorMessage(message: string) {
    swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
    })
  }

}
