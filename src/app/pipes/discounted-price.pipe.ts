import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountedPrice',
	standalone: true,
})
export class DiscountedPricePipe implements PipeTransform {
  transform(price: number, discount: number): number {
		if (discount === 0) {
			return price;
		}
		return price - price * (discount / 100);
  }
}