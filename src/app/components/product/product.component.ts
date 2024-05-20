import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountTimerComponent } from './discount-timer/discount-timer.component';
import { CharactersLimitationPipe } from './characters-limitation.pipe';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, DiscountTimerComponent, CharactersLimitationPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  @Input() product!: Product;

  getDiscountedPrice(): number {
    let result =
      this.product.price - this.product.price * (this.product.discount / 100);
    return result;
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
      this.isDiscountTagActive(),
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

  isDiscountTagActive(): boolean {
    const currentTime = new Date().getTime();
    const discountTime = new Date(this.product.discountUntil).getTime();
    return discountTime > currentTime;
  }
}
