import { Component, OnInit } from '@angular/core';
import { Dish }from "../shared/dish";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Feedback } from '../shared/feedback2';


import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { DishService } from '../services/dish.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  feedback:Feedback;
  feedbackForm:FormGroup;
  date:Date;

  formErrors = {
    'name': '', 
   'rating':'',
    'comment': ''
  };
  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    
    'comment': {
      'required':      'Comment is required.'
    }
  };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, private fb:FormBuilder) { 
     
      this.createForm();
    }

  ngOnInit() {
    
    //let id = +this.route.snapshot.params['id'];
    //this.dishservice.getDish(id).then(dish=>this.dish=dish); using promise
    //this.dishservice.getDish(id).subscribe(dish=>this.dish=dish); //using observable

    //using params observable
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    
  }
  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      name : ['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      rating : [''],
      comment : ['',Validators.required]
    });
    this.feedbackForm.valueChanges   //valueChanges observable
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any){
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit(){
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.date=new Date();
    this.feedbackForm.reset({
      name: '',
      rating: '',
      comment: ''
    });
  }
  

}
