import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-delivery-date',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './delivery-date.component.html',
  styleUrl: './delivery-date.component.scss',
})
export class DeliveryDateComponent implements OnInit {
  @Input() deliveryDateGroup!: FormGroup<{
    dateOption: FormControl<string | null>;
    date: FormControl<string | null>;
  }>;
  @Input() dateOptions!: {
    today: string;
    tomorrow: string;
    choose: string;
  };
  @Output() nextClicked = new EventEmitter();
  @Output() backClicked = new EventEmitter();

  isDateGroupValid$!: Observable<boolean>;

  isDateGroupValid(): boolean {
    const controls = this.deliveryDateGroup.controls;
    if (controls.dateOption.value === this.dateOptions.choose) {
      return controls.date.valid;
    }
    return controls.dateOption.valid;
  }

  emitNextClicked() {
    this.nextClicked.emit();
  }

  emitBackClicked() {
    this.backClicked.emit();
  }

  get showCalendar(): boolean {
    return (
      (this.deliveryDateGroup.controls.dateOption.value || '') ===
      this.dateOptions.choose
    );
  }

  ngOnInit(): void {
    this.isDateGroupValid$ = this.deliveryDateGroup.valueChanges.pipe(
      startWith(true), // ensures that validity is checked on init
      map(() => this.isDateGroupValid())
    );
  }
}
