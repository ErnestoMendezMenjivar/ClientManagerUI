import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../paginator/paginator.component';
import { DetalleComponent } from './detalle/detalle.component';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import swal from 'sweetalert2';
import { ActivatedRoute, RouterModule } from "@angular/router";

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule,PaginatorComponent,DetalleComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent  implements OnInit {

clientes: Cliente[];
paginador:any;
clienteSeleccionado: Cliente;


constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private modalService: ModalService){

}

ngOnInit(){

   

  this.activatedRoute.paramMap.subscribe(params =>{

    let page: number = +params.get('page');

    if(!page){
      page = 0;
    }

    this.clienteService.getClientes(page).subscribe(response => {
      this.clientes = response.content as Cliente[]
      this.paginador = response;
    });
  })

  this.modalService.notificarUpload.subscribe(cliente => {
    this.clientes = this.clientes.map(clienteOriginal => {
      if(cliente.id == clienteOriginal.id){
        clienteOriginal.foto = cliente.foto;
      }
      return clienteOriginal;
    })
  })

}

delete(clientee: Cliente): void {
  swal.fire({
    title: "Estas seguro?",
    text: `Seguro que desea eliminar al cliente ${clientee.nombre}  ${clientee.apellido}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminalo!",
    cancelButtonText: "No, cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      this.clienteService.delete(clientee.id).subscribe(
        (response: any) => {
          this.clientes = this.clientes.filter(cli => cli !== clientee)
          swal.fire({
            title: "Cliente eliminado!",
            text: `Cliente ${clientee.nombre}  eliminado con exito!!`,
            icon: "info"
          });
        }
      )
    }
  });
}


abrirModal(cliente: Cliente){
  this.clienteSeleccionado = cliente;

  this.modalService.abrirModal();

}

}
