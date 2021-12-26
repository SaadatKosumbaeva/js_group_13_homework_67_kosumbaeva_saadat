import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MealsService } from '../../shared/meals.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Meal } from '../../shared/meal.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.component.html',
  styleUrls: ['./edit-meal.component.css']
})
export class EditMealComponent implements OnInit, OnDestroy {
  @ViewChild('f') mealForm!: NgForm;

  mealUploadingSubscription!: Subscription;
  isUploading = false;
  isEdit = false;
  editedId = '';
  date = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mealsService: MealsService) {
  }

  ngOnInit(): void {
    this.mealUploadingSubscription = this.mealsService.mealUploading.subscribe((isUploading: boolean) => {
      this.isUploading = isUploading;
    });
    this.route.data.subscribe(data => {
      const meal = <Meal | null>data.meal;

      if (meal) {
        this.isEdit = true;
        this.editedId = meal.id;
        this.setFormValue({
          time: meal.time,
          description: meal.description,
          calories: meal.calories,
          date: meal.date
        })
      } else {
        this.isEdit = false;
        this.editedId = '';
        this.setFormValue({
          time: 'breakfast',
          description: '',
          calories: '',
          date: new Date().toISOString().slice(0, 10),
        })
      }
    });
  }

  saveMeal() {
    if (!this.mealForm.value.description.trim().length || !String(this.mealForm.value.calories).length) {
      return;
    }
    const id = this.editedId || Math.random().toString();
    const meal = new Meal(id, this.mealForm.value.time, this.mealForm.value.description, this.mealForm.value.calories, this.mealForm.value.date);

    const next = () => {
      this.mealsService.fetchMeals();
      if (!this.isEdit) {
        void this.router.navigate(['']);
      }
    }

    if (this.isEdit) {
      this.mealsService.editMeal(meal).subscribe(next);
    } else {
      this.mealsService.addMeal(meal).subscribe(next);
    }
  }

  setFormValue(value: { [key: string]: any }) {
    setTimeout(() => {
      this.mealForm.setValue(value);
    });
  }

  ngOnDestroy() {
    this.mealUploadingSubscription.unsubscribe();
  }
}
