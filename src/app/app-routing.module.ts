import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditMealComponent } from './meals/edit-meal/edit-meal.component';
import { MealResolverService } from './meals/meal-resolver.service';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'meals/new', component: EditMealComponent},
  {
    path: 'meals/:id/edit', component: EditMealComponent, resolve: {
      meal: MealResolverService
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
