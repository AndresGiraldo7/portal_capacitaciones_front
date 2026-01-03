import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuloService } from '../../core/services/modulo';
import { Modulo } from '../../core/models';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-lista-modulos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './lista-modulos.html',
  styleUrls: ['./lista-modulos.css'],
})
export class ListaModulosComponent implements OnInit {
  modulos: Modulo[] = [];
  loading = true;

  iconos: { [key: string]: string } = {
    Fullstack: '🖥',
    'APIs e Integraciones': '🔗',
    Cloud: '☁️',
    'Data Engineer': '📊',
  };

  constructor(private moduloService: ModuloService, private router: Router) {}

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    this.moduloService.listarModulos().subscribe({
      next: (data) => {
        console.log('📦 MÓDULOS COMPLETOS:', JSON.stringify(data, null, 2)); // ← AGREGA ESTO
        this.modulos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar módulos', err);
        this.loading = false;
      },
    });
  }

  verCursos(idModulo: number): void {
    console.log('🔍 ID RECIBIDO:', idModulo); // ← AGREGA ESTO
    console.log('🔍 TIPO:', typeof idModulo); // ← Y ESTO

    if (!idModulo) {
      console.error('❌ ID es undefined o null');
      return;
    }

    this.router.navigate(['/cursos', idModulo]);
  }

  getIcono(nombre: string): string {
    return this.iconos[nombre] || '📚';
  }
}
