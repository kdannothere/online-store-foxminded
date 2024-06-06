import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../models/item';
import { CharactersLimitationPipe } from '../../../../pipes/characters-limitation.pipe';
import { CommonModule } from '@angular/common';
import { PriceService } from '../../../../services/price.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    CharactersLimitationPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  @Input() item!: Item;
  @Input() itemIndex!: number;
  @Input() inSummary: boolean = false;
  quantity!: FormControl;

  get price(): number {
    const productPrice = this.priceService.getDiscountedPrice(
      this.item.price,
      this.item.discount,
      this.item.discountUntil
    );
		const quantity = this.quantity.value as number;
		if (quantity < 100 && quantity > 0) {
			return quantity * productPrice;
		}
    return productPrice;
  }

  constructor(public priceService: PriceService) {}

  ngOnInit(): void {
    this.quantity = new FormControl(1, Validators.required);
  }
}
