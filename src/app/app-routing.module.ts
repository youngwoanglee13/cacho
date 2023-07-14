import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableroComponent } from './tablero/tablero.component';

const routes: Routes = [
  { path : '', redirectTo: 'tablero', pathMatch: 'full' },
  { path : 'tablero', component: TableroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
