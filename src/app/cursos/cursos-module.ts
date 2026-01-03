import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosRoutingModule } from './cursos-routing-module';
import { ListaModulosComponent } from './lista-modulos/lista-modulos';
import { ListaCursosComponent } from './lista-cursos/lista-cursos';

@NgModule({
  declarations: [],
  imports: [CommonModule, CursosRoutingModule],
})
export class CursosModule {}
