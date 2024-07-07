import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  isDiscountActive(discountUntil: string) {
    const currentTime = new Date().getTime();
    const discountTime = new Date(discountUntil).getTime();
    return discountTime > currentTime;
  }

  getDiscountedPrice(
    price: number,
    discount: number,
    discountUntil: string
  ): number {
    if (discount === 0 || !this.isDiscountActive(discountUntil)) {
      return price;
    }
    return price - price * (discount / 100);
  }
}
