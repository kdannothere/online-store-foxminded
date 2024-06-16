import { Component } from '@angular/core';
import { ShopDataService } from '../../../../services/shop-data.service';
import { Product } from '../../../../models/product';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [
		CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.scss',
})
export class AddNewProductComponent {
  productForm = this.getEmptyProductForm();

  getEmptyProductForm() {
    return new FormGroup({
      imageUrl: new FormControl('', [
        Validators.required,
        Validators.maxLength(2000),
      ]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      discount: new FormControl(0, [Validators.required, Validators.min(0)]),
      main: new FormControl(false, Validators.required),
      shop: new FormControl('', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(4000),
      ]),
      shipping: new FormControl<string | null>(null, Validators.required),
      discountUntil: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      isNew: new FormControl(true, Validators.required),
      color: new FormGroup({
        blue: new FormControl<boolean>(false),
        grey: new FormControl<boolean>(false),
        orange: new FormControl<boolean>(false),
        black: new FormControl<boolean>(false),
        green: new FormControl<boolean>(false),
      }),
      size: new FormGroup({
        xs: new FormControl<boolean>(false),
        s: new FormControl<boolean>(false),
        l: new FormControl<boolean>(false),
        xl: new FormControl<boolean>(false),
        xxl: new FormControl<boolean>(false),
      }),
    });
  }

  addProduct() {
    const controls = this.productForm.controls;

    const product: Product = {
      id: this.shopDataService.getUniqueId(),
      imgUrl: controls.imageUrl.value || '',
      price: controls.price.value || 0,
      discount: controls.discount.value || 0,
      main: controls.main.value || false,
      shop: controls.shop.value || '',
      name: controls.name.value || '',
      description: controls.description.value || '',
      shipping: controls.shipping.value,
      discountUntil:
        this.getUtcFromLocalDate(controls.discountUntil.value) || '',
      isNew: controls.isNew.value || false,
      color: this.getColors(),
      size: this.getSizes(),
      review: [],
    };

    this.shopDataService.addProduct(product);
  }

  reset() {
    this.productForm = this.getEmptyProductForm();
  }

  submit() {
    this.addProduct();
  }

  private getColors(): string[] {
    const controls = this.productForm.controls.color.controls;
    const colors: string[] = [];
    if (controls.black) colors.push('Black');
    if (controls.blue) colors.push('Blue');
    if (controls.green) colors.push('Green');
    if (controls.grey) colors.push('Grey');
    if (controls.orange) colors.push('Orange');
    return colors;
  }

  private getSizes(): string[] {
    const controls = this.productForm.controls.size.controls;
    const sizes: string[] = [];
    if (controls.xs) sizes.push('XS');
    if (controls.s) sizes.push('S');
    if (controls.l) sizes.push('L');
    if (controls.xl) sizes.push('XL');
    if (controls.xxl) sizes.push('XXL');
    return sizes;
  }

  private getUtcFromLocalDate(localDate: string | null): string | null {
    if (!localDate) return null;
    return new Date(localDate).toUTCString();
  }

  constructor(private shopDataService: ShopDataService) {}
}
