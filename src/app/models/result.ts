import { ShopError } from './shop-error';

export interface Result {
  data: any | null;
  error: ShopError | null;
}
