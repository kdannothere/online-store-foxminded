import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
})
export class PaymentMethodComponent implements OnInit {
  payment!: FormControl;
  paymentOptions = {
    card: 'Card',
    paypal: 'PayPal',
    cash: 'Cash',
  };

  ngOnInit(): void {
    this.payment = new FormControl(
      this.paymentOptions.card,
      Validators.required
    );
  }
}
