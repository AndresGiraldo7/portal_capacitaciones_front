import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCursosComponent } from './admin-cursos/admin-cursos';

const routes: Routes = [{ path: '', component: AdminCursosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
