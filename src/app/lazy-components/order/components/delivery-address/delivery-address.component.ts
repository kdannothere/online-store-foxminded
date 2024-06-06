import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-address',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
})
export class DeliveryAddressComponent implements OnInit {
  country!: FormControl;
  city!: FormControl;
  address!: FormControl;

  ngOnInit(): void {
    this.country = new FormControl('');
    this.city = new FormControl('');
    this.address = new FormControl('');
  }
}
