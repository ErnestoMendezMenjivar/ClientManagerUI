import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'detalle-cliente',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent implements OnInit {

  public titulo: string = 'Detalle del cliente';
  progreso:number = 0;

  archivoSeleccionado = false;
  public datos: Cliente = new Cliente()
  @Input() cliente: Cliente;
  private fotoSeleccionada: File;
   imageUrl: string;
   clienteId: number;
  public nombreCliente: string;
  public apellidoCliente: string;
  public emailCliente: string;
  public fecha: Date;

  constructor(private clienteService: ClienteService, private route: ActivatedRoute, public modelService: ModalService) { }




  ngOnInit(): void {

  }
  


  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire({
        title: "Error al seleccionar imagen",
        text: `El archivo debe de ser de tipo imagen`,
        icon: "error",
        showConfirmButton: true
      });
      this.fotoSeleccionada = null;
    } else {
      if (event.target.files && event.target.files.length > 0) {
        this.archivoSeleccionado = true;
      } else {
        this.archivoSeleccionado = false;
      }
    }

  }

  subirFoto() {
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
      cliente => {
        this.cliente = cliente;
        this.modelService.notificarUpload.emit(this.cliente);
          swal.fire({
            title: "Imagen subida!",
            text: `Foto subida con exito!!`,
            icon: "info",
            showConfirmButton: false,
            timer: 2600
          });  
      }
    );

    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    fileInput.value = '';

  }

  cerrarModal() {
    this.modelService.cerrarModal();
    this.fotoSeleccionada = null;
    //window.location.reload();
  }

}
