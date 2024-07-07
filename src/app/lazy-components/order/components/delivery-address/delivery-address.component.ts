import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-delivery-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
})
export class DeliveryAddressComponent implements OnInit {
  @Input() deliveryAddressGroup!: FormGroup<{
    country: FormControl<string | null>;
    city: FormControl<string | null>;
    address: FormControl<string | null>;
  }>;
  @Output() nextClicked = new EventEmitter();
  @Output() backClicked = new EventEmitter();

  isAddressGroupValid$!: Observable<boolean>;

  isAddressGroupValid(): boolean {
    const controls = this.deliveryAddressGroup.controls;
    return (
      controls.address.valid && controls.city.valid && controls.country.valid
    );
  }

  emitNextClicked() {
    this.nextClicked.emit();
  }

  emitBackClicked() {
    this.backClicked.emit();
  }

  ngOnInit(): void {
    this.isAddressGroupValid$ = this.deliveryAddressGroup.valueChanges.pipe(
      startWith(true), // ensures that validity is checked on init
      map(() => this.isAddressGroupValid())
    );
  }
}
