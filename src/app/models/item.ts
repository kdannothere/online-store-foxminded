import { Product } from './product';

export interface Item extends Product {
  quantity: number;
}
