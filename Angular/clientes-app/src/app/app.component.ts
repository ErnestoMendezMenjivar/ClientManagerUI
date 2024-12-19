import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule, HeaderComponent,
    FooterComponent,DirectivaComponent, ClientesComponent,PaginatorComponent,DetalleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenido a Angular';

  curso = 'Ernesto Mendez';

}
