import { Component } from '@angular/core';
import { ShopDataService } from '../../../../services/shop-data.service';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
  productForm = this._getEmptyProductForm();

  constructor(
    private shopDataService: ShopDataService,
    private formBuilder: FormBuilder
  ) {}

  private _getEmptyProductForm() {
    return this.formBuilder.group({
      id: [this.shopDataService.getUniqueId().toString(), Validators.required],
      imgUrl: this.formBuilder.array([
        this.formBuilder.control('', Validators.required),
      ]),
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      main: [false, Validators.required],
      shop: ['', [Validators.required, Validators.maxLength(120)]],
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.maxLength(4000)]],
      shipping: ['null', Validators.required],
      discountUntil: '',
      isNew: [true, Validators.required],
      color: this.formBuilder.array([this.formBuilder.control('')]),
      size: this.formBuilder.array([this.formBuilder.control('')]),
    });
  }

  addImage() {
    const newImageForm = this.formBuilder.control('');
    this.productForm.controls.imgUrl.push(newImageForm);
    return false;
  }

  addColor() {
    const newSizeForm = this.formBuilder.control('');
    this.productForm.controls.color.push(newSizeForm);
    return false;
  }

  addSize() {
    const newSizeForm = this.formBuilder.control('');
    this.productForm.controls.size.push(newSizeForm);
    return false;
  }

  private _saveData() {
    if (!this.productForm.valid) {
      console.log('not valid productForm');
      return;
    }
    const formData = this.productForm.getRawValue();

    this.shopDataService
      .saveData(formData.id!, formData.shop!, JSON.stringify(formData))
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
  }

  reset() {
    this.productForm = this._getEmptyProductForm();
  }

  submit() {
    this._saveData();
  }
}
