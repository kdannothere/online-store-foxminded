import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { ShopDataService } from '../../services/shop-data.service';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  specialProducts: Product[] = [];
  products: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private shopDataService: ShopDataService,
    private router: Router
  ) {

    // Subscribe to allProducts$ and process the data
    this.shopDataService.getAllProducts()
		.pipe(takeUntil(this.destroy$))
		.subscribe((products) => {
      products.forEach((product) => {
        if (product.main) {
          this.specialProducts = [...this.specialProducts, product];
        } else {
          this.products = [...this.products, product];
        }
      });
    });
  }

  navigateToProductDetails(productId: string) {
    this.router.navigate([`/products/${productId}`]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
