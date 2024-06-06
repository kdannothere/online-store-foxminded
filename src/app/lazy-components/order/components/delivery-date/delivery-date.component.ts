import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

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
  dateOption!: FormControl;
  date!: FormControl;
  dateOptions = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    choose: 'Choose a date from the calendar',
  };
	get showCalendar():boolean {
		return this.dateOption.value.toString() === this.dateOptions.choose;
	}

  ngOnInit(): void {
    this.dateOption = new FormControl(
      this.dateOptions.choose,
      Validators.required
    );
    this.date = new FormControl('', Validators.required);
  }
}
