import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ItemComponent } from '../item/item.component';
import { Item } from '../../../../models/item';

@Component({
  selector: 'app-goods-selection',
  standalone: true,
  templateUrl: './goods-selection.component.html',
  styleUrl: './goods-selection.component.scss',
  imports: [ItemComponent, CommonModule, MatButtonModule],
})
export class GoodsSelectionComponent {
  @Input() items!: Item[];
}
