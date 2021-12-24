import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditMealComponent } from './meals/edit-meal/edit-meal.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'meals/new', component: EditMealComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
