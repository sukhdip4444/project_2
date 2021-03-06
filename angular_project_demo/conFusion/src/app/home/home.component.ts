import { Component, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService) { }

  ngOnInit() {
    // this.dishservice.getFeaturedDish().then(dish=>this.dish=dish); using promise
    this.dishservice.getFeaturedDish().subscribe(dish=>this.dish=dish); //using observable
     this.promotionservice.getFeaturedPromotion().then(promo=>this.promotion=promo);
  }

}