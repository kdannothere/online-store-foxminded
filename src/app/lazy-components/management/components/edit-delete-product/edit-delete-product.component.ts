import { Component, ViewChild } from '@angular/core';
import { ShopDataService } from '../../../../services/shop-data.service';
import { MatButtonModule } from '@angular/material/button';
import { ProductFormComponent } from '../product-form/product-form.component';
import { first, map, take } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { shopMessages } from '../../../../shop-messages';

@Component({
  selector: 'app-edit-delete-product',
  standalone: true,
  imports: [
    ProductFormComponent,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './edit-delete-product.component.html',
  styleUrl: './edit-delete-product.component.scss',
})
export class EditDeleteProductComponent {
  constructor(private shopDataService: ShopDataService) {}
  @ViewChild('productFormComponentRef', { static: false })
  productFormComponent!: ProductFormComponent;

  formData!: any;
  loading = true;
  id: FormControl = new FormControl('', Validators.required);

  loadData() {
    if (!this.id.valid) {
      alert('Id is empty');
      return;
    }

    this.loading = true;
    this.formData = null;
    this.shopDataService
      .getProductFormDataById(this.id.value)
      .pipe(
        map((formData) => formData),
        first()
      )
      .subscribe((formData) => {
        if (formData) {
          this.formData = formData;
          this.loading = false;
          return;
        }
        alert(shopMessages.productNotFound);
      });
  }

  delete() {
    this.shopDataService
      .deleteProductFormData(
        this.productFormComponent.formData.id,
        this.productFormComponent.formData.shop || '',
				10000
      )
      .pipe(
        map((success) => success),
        take(1)
      )
      .subscribe((success) => {
        if (success) {
          alert(shopMessages.deletedProduct);
          return;
        }
        alert(shopMessages.notDeletedProduct);
      });
  }

  saveData() {
    if (!this.productFormComponent.isFormValid()) return;

    const formData = { ...this.productFormComponent.productForm.getRawValue() };

    this._saveReviews(formData);

    this.shopDataService
      .saveData(formData.id!, formData.shop, JSON.stringify(formData), 10000)
      .pipe(take(1))
      .subscribe((result) => {
        if (result.error) {
          console.error(result.error.msgDev);
          alert(result.error.msgUser);
          return;
        }
        alert(shopMessages.editedProduct);
      });
  }

  private _saveReviews(formData: any) {
    formData.review =
      (this.productFormComponent.formData &&
        this.productFormComponent.formData.review) ||
      [];
  }
}
