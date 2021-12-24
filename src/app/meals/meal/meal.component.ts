import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Meal } from '../../shared/meal.model';
import { MealsService } from '../../shared/meals.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit, OnDestroy {
  @Input() meal!: Meal;

  mealRemovingSubscription!: Subscription;
  isRemoving = false;
  removingMealId = '';

  constructor(private mealService: MealsService) { }

  ngOnInit(): void {
    this.mealRemovingSubscription = this.mealService.mealRemoving.subscribe((isRemoving: boolean) => {
      if (this.removingMealId) {
        this.isRemoving = isRemoving;
      }
    });
  }

  onRemove() {
    this.removingMealId = this.meal.id;
    this.mealService.removeMeal(this.meal.id).subscribe(() => {
      this.mealService.fetchMeals();
    });
  }

  ngOnDestroy(): void {
    this.mealRemovingSubscription.unsubscribe();
  }

}
