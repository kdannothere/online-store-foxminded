import { Component } from '@angular/core';
import { ShopDataService } from '../../../../services/shop-data.service';
import { Product } from '../../../../models/product';
import { Review } from '../../../../models/review';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { data } from '../../../../../assets/data';

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
      imageUrls: new FormArray([
        new FormControl('1', Validators.required),
        new FormControl(''),
        new FormControl(''),
        new FormControl(''),
        new FormControl(''),
      ]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      discount: new FormControl(0, [Validators.required, Validators.min(0)]),
      main: new FormControl(false, Validators.required),
      shop: new FormControl('1', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      name: new FormControl('name 1', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      description: new FormControl('ddd', [
        Validators.required,
        Validators.maxLength(4000),
      ]),
      shipping: new FormControl<string>('null', Validators.required),
      discountUntil: new FormControl(new Date('12/31/2050').toISOString()),
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

  saveData() {
		if (!this.productForm.valid) {
      console.log('not valid productForm');
      return;
    }
		const formData = this.productForm.getRawValue();
    const product: Product = {
      id: this.shopDataService.getUniqueId(),
      imgUrl: this.getImageUrls(formData),
      price: formData.price || 0,
      discount: formData.discount || 0,
      main: formData.main || false,
      shop: formData.shop || '',
      name: formData.name || '',
      description: formData.description || '',
      shipping: this.getShipping(formData),
      discountUntil:
        this.getUtcFromLocalDate(formData.discountUntil) || '',
      isNew: formData.isNew || false,
      color: this.getColors(formData),
      size: this.getSizes(formData),
      review: [],
    };
		
    // this.shopDataService
    //   .saveData(product, JSON.stringify(formData))
    //   .then((success) => {
    //     if (success) {
    //       console.log('Product added successfully!');
    //     } else {
    //       console.log('Failed to add product.');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
		this.saveAllOldProducts()
	}

  reset() {
    this.productForm = this.getEmptyProductForm();
  }

  submit() {
    this.saveData();
  }

	saveAllOldProducts() {
		const products: Product[] = [];
		data.forEach(product => {
			products.push(product as Product)
		});
		const formData = this.getEmptyProductForm().getRawValue()
		products.forEach(product => {
			this.shopDataService
      .saveData(product, JSON.stringify(formData))
      .then((success) => {
        if (success) {
          console.log('Product added successfully!');
        } else {
          console.log('Failed to add product.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
		});
	}

  private getImageUrls(formData: any): string[] {
    const imageUrls: string[] = [];
    formData.imageUrls.forEach(
      (imageUrl: string) => {
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }
    );
    return imageUrls;
  }

  private getShipping(formData: any): string | null {
    if (formData.shipping === 'null') return null;
    return formData.shipping;
  }
  private getColors(formData: any): string[] {
    const colorsData = formData.color;
    const colors: string[] = [];
    if (colorsData.black) colors.push('Black');
    if (colorsData.blue) colors.push('Blue');
    if (colorsData.green) colors.push('Green');
    if (colorsData.grey) colors.push('Grey');
    if (colorsData.orange) colors.push('Orange');
    return colors;
  }

  private getSizes(formData: any): string[] {
    const sizesData = formData.size;
    const sizes: string[] = [];
    if (sizesData.xs) sizes.push('XS');
    if (sizesData.s) sizes.push('S');
    if (sizesData.l) sizes.push('L');
    if (sizesData.xl) sizes.push('XL');
    if (sizesData.xxl) sizes.push('XXL');
    return sizes;
  }

  private getUtcFromLocalDate(localDate: string | null): string | null {
    if (!localDate) return null;
    return new Date(localDate).toUTCString();
  }

  constructor(private shopDataService: ShopDataService) {}
}
