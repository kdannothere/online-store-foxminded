import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class PaymentMethodComponent {
  @Input() payment!: FormControl;
  @Input() paymentOptions!: {
    card: string;
    paypal: string;
    cash: string;
  };
	@Output() nextClicked = new EventEmitter();
	@Output() backClicked = new EventEmitter();
	
	emitNextClicked() {
    this.nextClicked.emit();
  }
	
	emitBackClicked() {
    this.backClicked.emit();
  }
}
