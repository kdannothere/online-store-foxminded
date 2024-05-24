import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { ShopDataService } from '../../services/shop-data.service';
import { Observable, map } from 'rxjs';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  allProducts$: Observable<Product[]>;
  specialProducts$: Observable<Product[]>;
  products$: Observable<Product[]>;

  constructor(private shopDataService: ShopDataService, private router: Router) {
    this.allProducts$ = this.shopDataService.getAllProducts();
    this.specialProducts$ = this.allProducts$.pipe(
      map((products) => products.filter((product) => product.main))
    );
    this.products$ = this.allProducts$.pipe(
      map((products) => products.filter((product) => !product.main))
    );
  }

	navigateToOtherPage(productId: number) {
    this.router.navigate([`/products/${productId}`]);
  }
}
