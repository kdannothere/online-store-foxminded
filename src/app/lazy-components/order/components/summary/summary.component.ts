import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ItemComponent } from '../item/item.component';
import { Item } from '../../../../models/item';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [ItemComponent, CommonModule, MatButtonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  @Input() items!: Item[];
  @Input() deliveryAddress: string = '';
  @Input() paymentMethod: string = '';
  @Input() deliveryDate: string = '';
  @Input() itemsQuantity!: any;
  readonly inSummary = true;
  @Output() backClicked = new EventEmitter();
  @Output() resetClicked = new EventEmitter();
  @Output() submitClicked = new EventEmitter();

  emitBackClicked() {
    this.backClicked.emit();
  }

  emitResetClicked() {
    this.resetClicked.emit();
  }

  emitSubmitClicked() {
    this.submitClicked.emit();
  }
}
