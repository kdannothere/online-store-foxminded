import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountTimerComponent } from './discount-timer/discount-timer.component';
import { CharactersLimitationPipe } from '../../pipes/characters-limitation.pipe';
import { Product } from '../../models/product';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { PriceService } from '../../services/price.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ProductDetailsComponent,
    DiscountTimerComponent,
    CharactersLimitationPipe,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  @Input() product!: Product;
  @Output() clicked = new EventEmitter<void>();

  constructor(public priceService: PriceService) {}

  handleClick() {
    this.clicked.emit();
  }

  getDiscountClass(discount: number): string {
    if (discount > 70) return 'product--high-discount';
    if (discount > 50) return 'product--medium-discount';
    return 'product--low-discount';
  }

  getTagClass(): string {
    const activeTags = [
      this.isShippingTagActive(),
      this.product.isNew,
      this.priceService.isDiscountActive(this.product.discountUntil),
    ].filter(Boolean).length;
    let classes = 'tag'; // Base class applied to every tag
    switch (activeTags) {
      case 3:
        classes += ' tag--three-tags';
        break;
      case 2:
        classes += ' tag--two-tags';
        break;
      case 1:
        classes += ' tag--one-tag';
        break;
      // No default case needed since 'tag' is always applied
    }
    return classes;
  }

  isShippingTagActive(): boolean {
    return this.product.shipping !== null;
  }
}
