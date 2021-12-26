import { Injectable } from '@angular/core';
import { Meal } from './meal.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MealsService {
  meals: Meal[] = [];
  mealsChange = new Subject<Meal[]>();
  mealsFetching = new Subject<boolean>();
  mealUploading = new Subject<boolean>();
  mealRemoving = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  fetchMeals() {
    this.mealsFetching.next(true);
    this.http.get<{ [id: string]: Meal }>('https://skosumbaeva2502-default-rtdb.firebaseio.com/meals.json').pipe(
      map(result => {
        return Object.keys(result).map(id => {
          const mealData = result[id];
          return new Meal(id, mealData.time, mealData.description, mealData.calories, mealData.date);
        })
      })
    )
      .subscribe(result => {
        this.meals = result;
        this.mealsChange.next(result);
        this.mealsFetching.next(false);
      }, () => {
        if (this.meals.length === 1) {
          this.meals = [];
          this.mealsChange.next(this.meals);
        }
        this.mealsFetching.next(false);
      });
  }

  fetchTodayMeals() {
    const date = new Date().toISOString().slice(0, 10);
    return this.http.get<{ [id: string]: Meal }>(`https://skosumbaeva2502-default-rtdb.firebaseio.com/meals.json?orderBy="date"&equalTo="${date}"`).pipe(
      map(result => {
        return Object.keys(result).map(id => {
          const mealData = result[id];
          return new Meal(mealData.id, mealData.time, mealData.description, mealData.calories, mealData.date);
        })
      })
    );
  }

  fetchMeal(id: string) {
    return this.http.get<Meal | null>(`https://skosumbaeva2502-default-rtdb.firebaseio.com/meals/${id}.json`).pipe(
      map(result => {
        if (!result) {
          return null;
        }
        return new Meal(id, result.time, result.description, result.calories, result.date);
      })
    );
  }

  addMeal(meal: Meal) {
    const body = {
      time: meal.time,
      description: meal.description,
      calories: meal.calories,
      date: meal.date
    }

    this.mealUploading.next(true);
    return this.http.post('https://skosumbaeva2502-default-rtdb.firebaseio.com/meals.json', body).pipe(
      tap(() => {
        this.mealUploading.next(false);
      }, () => {
        this.mealUploading.next(false);
      })
    );
  }

  editMeal(meal: Meal) {
    const body = {
      time: meal.time,
      description: meal.description,
      calories: meal.calories,
      date: meal.date
    }

    this.mealUploading.next(true);
    return this.http.put(`https://skosumbaeva2502-default-rtdb.firebaseio.com/meals/${meal.id}.json`, body).pipe(
      tap(() => {
        this.mealUploading.next(false);
      }, () => {
        this.mealUploading.next(false);
      })
    );
  }

  removeMeal(id: string) {
    this.mealRemoving.next(true);
    return this.http.delete(`https://skosumbaeva2502-default-rtdb.firebaseio.com/meals/${id}.json`).pipe(
      tap(() => {
        this.mealRemoving.next(false);
      }, () => {
        this.mealRemoving.next(false);
      })
    );
  }

}
