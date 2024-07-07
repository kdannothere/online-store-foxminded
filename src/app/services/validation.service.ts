import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  isLengthValid(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      const isValid = value.length >= min && value.length <= max;

      if (isValid) {
        return null; // Valid length
      } else {
        return { invalidLength: true }; // Invalid length
      }
    };
  }
}
