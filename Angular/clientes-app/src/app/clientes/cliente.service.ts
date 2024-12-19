import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Region} from './region';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8087/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  public texto: string;

  constructor(private http: HttpClient, private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }


  getClientes(page: number): Observable <any>{

    return  this.http.get<Cliente[]>(this.urlEndPoint + '/page/' + page).pipe(
      tap((response:any) =>{
        
        (response.content as Cliente[]).forEach(cliente => {
          
        })
      }),
      map((response:any) => {
        
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.apellido = cliente.apellido.toUpperCase();
          return cliente;
        });
        return response;
      } 
      )
    );
  }


  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(error => {

        if(error.status==400){
          return throwError(error);
        }

        if(error.error.Error.includes('Duplicate entry')){
          const errorMessage ='El correo ya existe en la base de datos';
          swal.fire({
            icon: 'error',
            title: 'Error al crear el cliente',
            text: errorMessage,
            showConfirmButton: true
         });
        }else{
          console.log('Error en la creación del cliente:', error); // Agregado para depuración
          const errorMessage = error.error.mensaje || 'Error desconocido';
          const errorM = error.error.Error;
          swal.fire({
            icon: 'error',
            title: errorMessage,
            text: errorM,
            showConfirmButton: true
         });
        }

        return throwError(error);
      })
    );
  }
  


  getClienteById(id) : Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(error => {
        this.router.navigate(['/clientes'])
        const errorMessage = error?.error?.mensaje;
        console.log(errorMessage);
        swal.fire({
          icon: 'error',
          title: 'Error al obtener cliente',
          text: errorMessage,
          showConfirmButton: true
        })
        return throwError(error);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers: this.httpHeaders}).pipe(
      catchError(error => {

        if(error.status==400){
          return throwError(error);
        }

         console.log('Error en la creación del cliente:', error); // Agregado para depuración
        return throwError(error);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders}).pipe(
      catchError(error => {
        console.log('Error en la creación del cliente:', error); // Agregado para depuración
        const errorMessage = error.error.mensaje || 'Error desconocido';
        const errorM = error.error.Error;
        swal.fire({
          icon: 'error',
          title: errorMessage,
          text: errorM,
          showConfirmButton: true
        });
        return throwError(error);
      })
    );
  }


   subirFoto(archivo: File, id): Observable<Cliente> {
     let formData = new FormData();
     formData.append('archivo', archivo);
     formData.append('id', id);

     return this.http.post(`${this.urlEndPoint}/upload`, formData,).pipe(
       map((response: any) => response.cliente as Cliente),
       catchError(error => {
         console.log('Error en la creación del cliente:', error); // Agregado para depuración
         const errorMessage = error.error.mensaje || 'Error desconocido';
         const errorM = error.error.Error;
         swal.fire({
           icon: 'error',
           title: errorMessage,
           text: errorM,
           showConfirmButton: true
         });
         return throwError(error);
       })
     );
   }

}
