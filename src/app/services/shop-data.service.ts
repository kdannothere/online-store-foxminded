import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { data } from '../../assets/data';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ShopDataService {
  getAllProducts(): Observable<Product[]> {
    return of(data);
  }

  getUniqueId(): number {
    return data.length + 1;
  }

  getProductById(id: number): Observable<Product | null> {
    const item = data.find((item) => item.id === id);
    return item ? of(item) : of(null); // Return product or null when product is not found
  }

  addProduct(product: Product) {}

  // updateProduct(product: Product) {}

  // deleteProduct(product: Product) {}
}
