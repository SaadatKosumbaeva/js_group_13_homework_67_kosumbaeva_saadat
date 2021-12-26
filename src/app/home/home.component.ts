import { Component, OnDestroy, OnInit } from '@angular/core';
import { MealsService } from '../shared/meals.service';
import { Meal } from '../shared/meal.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  meals: Meal[] = [];
  todayMeals: Meal[] = [];
  mealsChangeSubscription!: Subscription;

  constructor(private mealsService: MealsService) {
  }

  ngOnInit(): void {
    this.meals = this.mealsService.meals;
    this.mealsChangeSubscription = this.mealsService.mealsChange.subscribe((meals: Meal[]) => {
      this.meals = meals;
      this.mealsService.fetchTodayMeals().subscribe(result => {
        this.todayMeals = result;
      });
    });
    this.mealsService.fetchMeals();
    this.mealsService.fetchTodayMeals().subscribe(result => {
      this.todayMeals = result;
    });
  }

  getTotalCalories() {
    let calories = 0;
    this.todayMeals.forEach(meal => {
      calories += parseInt(String(meal.calories));
    })
    return calories;
  }

  ngOnDestroy(): void {
    this.mealsChangeSubscription.unsubscribe();
  }

}
