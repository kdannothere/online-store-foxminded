import { Error } from './error';

export interface Result {
  data: any | null;
  error: Error | null;
}
