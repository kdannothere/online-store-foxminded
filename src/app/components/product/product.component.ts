import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountTimerComponent } from './discount-timer/discount-timer.component';
import { CharactersLimitationPipe } from './characters-limitation.pipe';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, DiscountTimerComponent, CharactersLimitationPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})

export class ProductComponent {
  @Input() imgUrl: string = '';
  @Input() discount: number = 0;
  @Input() price: number = 0;

  get priceDiscounted(): number {
    let result = this.price - this.price * (this.discount / 100);
    return result;
  }

  @Input() main: boolean = false;
  @Input() shop: string = '';
  @Input() description: string = 'No description';

  // tag
  // example: 'Free shipping' or null
  @Input() shipping: string | null = null;

  // tag
  @Input() isNew: boolean = false;

  // tag
	// example: '2025-06-02T10:00:00'
  @Input() discountUntil: string = "";

  getDiscountClass(discount: number): string {
    if (discount > 70) return 'product--high-discount';
    if (discount > 50) return 'product--medium-discount';
    return 'product--low-discount';
  }

	getTagClass(): string {
		const activeTags = [this.isShippingTagActive(), this.isNew, this.isDiscountTagActive()].filter(Boolean).length;
		let classes = 'tag'; // Base class applied to every tag
		switch (activeTags) {
			case 3: classes += ' tag--three-tags'; break;
			case 2: classes += ' tag--two-tags'; break;
			case 1: classes += ' tag--one-tag'; break;
			// No default case needed since 'tag' is always applied
		}
		return classes;
	}

  isShippingTagActive(): boolean {
    return this.shipping !== null;
  }

  isDiscountTagActive(): boolean {
		const currentTime = new Date().getTime();
    const discountTime = new Date(this.discountUntil).getTime();
    return discountTime > currentTime;
  }
}
