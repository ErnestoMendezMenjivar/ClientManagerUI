import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-directiva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './directiva.component.html',
  styleUrl: './directiva.component.css'
})
export class DirectivaComponent {

  listaCurso: string [] = ['TypeScript','JavaScript','Java SE','C#','Python'];

  habilitar: boolean = true;

  setHbailitar(): void {
    this.habilitar = (this.habilitar == true)? false: true;
  }

}
