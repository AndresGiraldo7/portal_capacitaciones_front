import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaModulosComponent } from './lista-modulos/lista-modulos';
import { ListaCursosComponent } from './lista-cursos/lista-cursos';

const routes: Routes = [
  { path: '', component: ListaModulosComponent },
  { path: ':idModulo', component: ListaCursosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosRoutingModule {}
