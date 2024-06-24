import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-product-form',
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
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.getProductForm();
  }

  private _formData: any = null;

  @Input()
  set formData(value: any) {
    this._formData = JSON.parse(value as string) || null;
  }

  get formData(): any {
    return this._formData;
  }

  productForm!: any;

  getProductForm() {
    return this.formBuilder.group({
      id: this._getId(),
      imgUrl: this._getImgUrl(),
      price: this._getPrice(),
      discount: this._getDiscount(),
      main: this._getMain(),
      shop: this._getShop(),
      name: this._getName(),
      description: this._getDescription(),
      shipping: this._getShipping(),
      discountUntil: this._getDiscountUntil(),
      isNew: this._getIsNew(),
      color: this._getColor(),
      size: this._getSize(),
    });
  }

  private _getId(): FormControl<string | null> {
    let value = this.getUniqueId().toString();
    if (this.formData && this.formData.id) value = this.formData.id.toString();
    return new FormControl(value, Validators.required);
  }

  private _getPrice(): FormControl<number | null> {
    let value = 0;
    if (this.formData && this.formData.price) value = this.formData.price;
    return new FormControl(value);
  }

  private _getDiscount(): FormControl<number | null> {
    let value = 0;
    if (this.formData && this.formData.discount) value = this.formData.discount;
    return new FormControl(value);
  }

  private _getMain(): FormControl<boolean | null> {
    let value = false;
    if (this.formData && (this.formData.main || this.formData.main === false))
      value = this.formData.main;
    return new FormControl(value);
  }

  private _getShop(): FormControl<string | null> {
    let value = '';
    if (this.formData && this.formData.shop) value = this.formData.shop;
    return new FormControl(value, Validators.required);
  }

  private _getName(): FormControl<string | null> {
    let value = '';
    if (this.formData && this.formData.name) value = this.formData.name;
    return new FormControl(value);
  }

  private _getDescription(): FormControl<string | null> {
    let value = '';
    if (this.formData && this.formData.description)
      value = this.formData.description;
    return new FormControl(value);
  }

  private _getShipping(): FormControl<string | null> {
    let value = null;
    if (this.formData && this.formData.shipping) value = this.formData.shipping;
    return new FormControl(value);
  }

  private _getDiscountUntil(): FormControl<string | null> {
    let value = '';
    if (this.formData && this.formData.discountUntil)
      value = this.formData.discountUntil;
    return new FormControl(value);
  }

  private _getIsNew(): FormControl<boolean | null> {
    let value = true;
    if (this.formData && (this.formData.isNew || this.formData.isNew === false))
      value = this.formData.isNew;
    return new FormControl(value);
  }

  private _getImgUrl(): FormArray<FormControl<string | null>> {
    if (this.formData && this.formData.imgUrl.length) {
      const formArray = new FormArray<FormControl<string | null>>([]);
      this.formData.imgUrl.forEach((value: string) => {
        if (value) formArray.push(this.formBuilder.control(value));
      });
      if (formArray.controls.length) return formArray;
    }
    return this.formBuilder.array([this.formBuilder.control('')]);
  }

  private _getColor(): FormArray<FormControl<string | null>> {
    if (this.formData && this.formData.color.length) {
      const formArray = new FormArray<FormControl<string | null>>([]);
      this.formData.color.forEach((value: string) => {
        if (value) formArray.push(this.formBuilder.control(value));
      });
      if (formArray.controls.length) return formArray;
    }
    return this.formBuilder.array([this.formBuilder.control('')]);
  }

  private _getSize(): FormArray<FormControl<string | null>> {
    if (this.formData && this.formData.size.length) {
      const formArray = new FormArray<FormControl<string | null>>([]);
      this.formData.size.forEach((value: string) => {
        if (value) formArray.push(this.formBuilder.control(value));
      });
      if (formArray.controls.length) return formArray;
    }
    return this.formBuilder.array([this.formBuilder.control('')]);
  }

  addNewField(formArray: FormArray) {
    const newField = this.formBuilder.control('');
    formArray.push(newField);
    return false;
  }

  removeLastField(formArray: FormArray) {
    if (formArray.controls.length > 1) formArray.controls.pop();
    return false;
  }
  reset() {
    this.productForm = this.getProductForm();
  }
  isFormValid(): boolean {
    if (!this.productForm.valid) {
      alert('Some fields are not filled correctly :(');
      return false;
    }
    return true;
  }

  getUniqueId(): number {
    return new Date().getTime();
  }
}
