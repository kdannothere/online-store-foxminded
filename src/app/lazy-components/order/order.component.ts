import { Component, OnInit } from '@angular/core';
import { GoodsSelectionComponent } from './components/goods-selection/goods-selection.component';
import { Item } from '../../models/item';
import { Observable, map } from 'rxjs';
import { ShopDataService } from '../../services/shop-data.service';
import { Product } from '../../models/product';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { DeliveryDateComponent } from './components/delivery-date/delivery-date.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { SummaryComponent } from './components/summary/summary.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    GoodsSelectionComponent,
    DeliveryAddressComponent,
    DeliveryDateComponent,
    PaymentMethodComponent,
    SummaryComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  cartItems$: Observable<Item[]>;
  formGroup!: FormGroup;

  ngOnInit() {
    this.formGroup = new FormGroup({ items: new FormControl(this.cartItems$) });
  }

  constructor(private shopDataService: ShopDataService) {
    // mock items
    this.cartItems$ = this.shopDataService.getAllProducts().pipe(
      map((products: Product[]) => {
        return products
          .map((product: Product) => {
            const item: Item = { ...product, quantity: 1 };
            return item;
          })
          .filter((item) => item.id < 3);
      })
    );
  }
}
