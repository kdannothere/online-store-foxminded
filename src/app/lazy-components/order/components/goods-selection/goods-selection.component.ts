import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ItemComponent } from '../item/item.component';
import { Item } from '../../../../models/item';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-goods-selection',
  standalone: true,
  templateUrl: './goods-selection.component.html',
  styleUrl: './goods-selection.component.scss',
  imports: [ItemComponent, CommonModule, MatButtonModule],
})
export class GoodsSelectionComponent implements OnInit {
  @Input() items!: Item[];
  @Input() itemsQuantity!: any;
  @Output() nextClicked = new EventEmitter();

  emitNextClicked() {
    this.nextClicked.emit();
  }

  isFormArrayValid$!: Observable<boolean>;

  isFormArrayValid(): boolean {
    return (this.itemsQuantity as FormArray).controls.every(
      (control) => control.valid
    );
  }

  ngOnInit(): void {
    const itemsQuantity = this.itemsQuantity as FormArray;
    if (itemsQuantity.length === 0) {
      this.items.forEach((_item) => {
        itemsQuantity.push(new FormControl(1, Validators.required));
      });
    }
    this.isFormArrayValid$ = itemsQuantity.valueChanges.pipe(
      startWith(true), // ensures that validity is checked on init
      map(() => this.isFormArrayValid())
    );
  }
}
