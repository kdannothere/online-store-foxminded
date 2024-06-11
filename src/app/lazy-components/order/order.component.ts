import { Component, OnInit } from '@angular/core';
import { GoodsSelectionComponent } from './components/goods-selection/goods-selection.component';
import { Item } from '../../models/item';
import { Observable, map } from 'rxjs';
import { ShopDataService } from '../../services/shop-data.service';
import { Product } from '../../models/product';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { DeliveryDateComponent } from './components/delivery-date/delivery-date.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ValidationService } from '../../services/validation.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    GoodsSelectionComponent,
    DeliveryAddressComponent,
    DeliveryDateComponent,
    PaymentMethodComponent,
    SummaryComponent,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  cartItems$: Observable<Item[]>;

  paymentOptions = {
    card: 'Card',
    paypal: 'PayPal',
    cash: 'Cash',
  };

  dateOptions = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    choose: 'Choose a date from the calendar',
  };

  orderForm = this.getEmptyOrderForm();

  blocks = {
    goods: 1,
    address: 2,
    payment: 3,
    date: 4,
    summary: 5,
  };
  activeBlock = this.blocks.goods;

  nextEventHandler() {
    ++this.activeBlock;
  }

  backEventHandler() {
    --this.activeBlock;
  }

  resetEventHandler() {
    this.activeBlock = this.blocks.goods;
    this.orderForm = this.getEmptyOrderForm();
  }

  submitEventHandler() {
		this.router.navigate(['/order/thanks']);
	}

  get deliveryAddress(): string {
    return (
      this.orderForm.controls.deliveryAddressGroup.controls.address.value +
      ', ' +
      this.orderForm.controls.deliveryAddressGroup.controls.city.value +
      ', ' +
      this.orderForm.controls.deliveryAddressGroup.controls.country.value
    );
  }

  get deliveryDate(): string {
    const dateOption =
      this.orderForm.controls.deliveryDateGroup.controls.dateOption.value;
    if (dateOption === this.dateOptions.today) {
      return new Date().toDateString();
    }
    if (dateOption === this.dateOptions.tomorrow) {
      const tomorrow = new Date(); // is today
      tomorrow.setDate(tomorrow.getDate() + 1); // becomes tomorrow
      return tomorrow.toDateString();
    }
    const date = this.orderForm.controls.deliveryDateGroup.controls.date.value;
    if (!date) return '';
    return new Date(date).toDateString();
  }

  getEmptyOrderForm() {
    return new FormGroup({
      itemsQuantity: new FormArray([]),
      deliveryAddressGroup: new FormGroup({
        country: new FormControl('', [
          Validators.required,
          this.validationService.isLengthValid(1, 33),
        ]),
        city: new FormControl('', [
          Validators.required,
          this.validationService.isLengthValid(1, 50),
        ]),
        address: new FormControl('', [
          Validators.required,
          this.validationService.isLengthValid(1, 100),
        ]),
      }),
      deliveryDateGroup: new FormGroup({
        dateOption: new FormControl(
          this.dateOptions.today,
          Validators.required
        ),
        date: new FormControl('', Validators.required),
      }),
      payment: new FormControl(this.paymentOptions.card, Validators.required),
    });
  }

  constructor(
    private shopDataService: ShopDataService,
    private validationService: ValidationService,
    private router: Router
  ) {
    // mock items
    this.cartItems$ = this.shopDataService.getAllProducts().pipe(
      map((products: Product[]) => {
        return products
          .map((product: Product) => {
            const item: Item = { ...product, quantity: 1 };
            return item;
          })
          .filter((item) => item.id < 2);
      })
    );
  }
}
