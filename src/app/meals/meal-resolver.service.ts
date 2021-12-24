import { Injectable } from '@angular/core';
import { MealsService } from '../shared/meals.service';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Meal } from '../shared/meal.model';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MealResolverService implements Resolve<Meal> {
  constructor(private router: Router,
              private mealsService: MealsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Meal> | Observable<never> {
    const mealId = <string>route.params['id'];
    return this.mealsService.fetchMeal(mealId).pipe(mergeMap(meal => {
      if (meal) {
        return of(meal);
      }
      void this.router.navigate(['/']);
      return EMPTY;
    }))
  }


}
