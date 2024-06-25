import { Component, ViewChild } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ShopDataService } from '../../../../services/shop-data.service';

@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [ProductFormComponent, MatButtonModule],
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.scss',
})
export class AddNewProductComponent {
  constructor(private shopDataService: ShopDataService) {}
  @ViewChild('productFormComponentRef', { static: false })
  productFormComponent!: ProductFormComponent;

  saveData() {
    if (!this.productFormComponent.isFormValid()) return;

    const formData = { ...this.productFormComponent.productForm.getRawValue() };

    this.shopDataService
      .saveData(
        formData.id!,
        formData.shop,
        JSON.stringify(formData)
      )
      .then((success) => {
        if (success) {
          alert('Data saved successfully :)');
        } else {
          alert('Failed to save data ¯\_(ツ)_/¯');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  resetForm() {
    this.productFormComponent.productForm =
      this.productFormComponent.getProductForm();
  }
}
