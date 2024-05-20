import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { ShopDataService } from '../../services/shop-data.service';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  allProducts$: Observable<Product[]>;
  specialProducts: Product[] = [];
  products: Product[] = [];

  constructor(private shopDataService: ShopDataService) {
    this.allProducts$ = this.shopDataService.getAllProducts();
    this.allProducts$.subscribe((products) => {
      // Update specialProducts and products whenever allProducts$ changes
      this.specialProducts = products.filter((product) => product.main);
      this.products = products.filter((product) => !product.main);
    });
  }
}
