import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { ShopDataService } from '../../services/shop-data.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
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
  allProducts$: Observable<Product[]>;
  specialProducts$: Observable<Product[]>;
  products$: Observable<Product[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private shopDataService: ShopDataService,
    private router: Router
  ) {
    this.allProducts$ = this.shopDataService.getAllProducts();
    this.specialProducts$ = this.allProducts$.pipe(
      map((products) => products.filter((product) => product.main)),
			takeUntil(this.destroy$)
    );
    this.products$ = this.allProducts$.pipe(
      map((products) => products.filter((product) => !product.main)),
			takeUntil(this.destroy$)
    );
  }

  navigateToOtherPage(productId: number) {
    this.router.navigate([`/products/${productId}`]);
  }

	ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
