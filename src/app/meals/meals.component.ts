import { Component, OnInit } from '@angular/core';
import { MealsService } from '../shared/meals.service';
import { Subscription } from 'rxjs';
import { Meal } from '../shared/meal.model';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  mealsFetchingSubscription!: Subscription;
  mealsChangeSubscription!: Subscription;
  isFetching = false;
  meals: Meal[] = [];

  constructor(private mealsService: MealsService) { }

  ngOnInit(): void {
    this.meals = this.mealsService.meals;
    this.mealsFetchingSubscription = this.mealsService.mealsFetching.subscribe((isFetching: boolean) => {
      this.isFetching = isFetching;
    });
    this.mealsChangeSubscription = this.mealsService.mealsChange.subscribe((meals: Meal[]) => {
      this.meals = meals;
    })
    this.mealsService.fetchMeals();
  }

}
