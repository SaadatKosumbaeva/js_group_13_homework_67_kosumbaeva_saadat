import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../../shared/meal.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  @Input() meal!: Meal;
  constructor() { }

  ngOnInit(): void {
  }

}
