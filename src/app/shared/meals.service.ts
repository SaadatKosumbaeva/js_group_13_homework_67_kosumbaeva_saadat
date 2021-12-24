import { Injectable } from '@angular/core';
import { Meal } from './meal.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MealsService {
  meals: Meal[] = [];
  mealsChange = new Subject<Meal[]>();
  mealsFetching = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  fetchMeals() {
    this.mealsFetching.next(true);
    this.http.get<{[id: string]: Meal}>('https://skosumbaeva2502-default-rtdb.firebaseio.com/meals.json').pipe(
      map(result => {
        return Object.keys(result).map(id => {
          const mealData = result[id];
          return new Meal(id, mealData.time, mealData.description, mealData.calories);
        })
      })
    )
      .subscribe(result => {
        this.meals = result;
        this.mealsChange.next(result);
        this.mealsFetching.next(false);
      }, () => {
        this.mealsFetching.next(false);
      })
  }

  fetchMeal(id: string) {
    return this.http.get<Meal | null>(`https://skosumbaeva2502-default-rtdb.firebaseio.com/meals/${id}.json`).pipe(
      map(result => {
        if (!result) {
          return null;
        }
        return new Meal(id, result.time, result.description, result.calories);
      })
    )
  }

}