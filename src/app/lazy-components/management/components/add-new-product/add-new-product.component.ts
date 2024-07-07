import { Component, ViewChild } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ShopDataService } from '../../../../services/shop-data.service';
import { take } from 'rxjs';
import { shopMessages } from '../../../../shop-messages';

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
      .saveData(formData.id!, formData.shop, JSON.stringify(formData), 10000)
      .pipe(take(1))
      .subscribe((result) => {
        if (result.error) {
          console.error(result.error.msgDev);
          alert(result.error.msgUser);
          return;
        }
        alert(shopMessages.addedProduct);
      });
  }

  resetForm() {
    this.productFormComponent.productForm =
      this.productFormComponent.getProductForm();
  }
}
