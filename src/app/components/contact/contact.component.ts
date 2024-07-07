import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FieldInputComponent } from '../field-input/field-input.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
		FieldInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(33),
    ]),
    surname: new FormControl('a', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(33),
    ]),
    email: new FormControl('a@aaa', [Validators.required, Validators.email]),
    message: new FormControl('1qqqqqqqqq', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000),
    ]),
  });

  get valid(): boolean {
    const controls = this.contactForm.controls;
    return (
      controls.name.valid &&
      controls.surname.valid &&
      controls.email.valid &&
      controls.message.valid
    );
  }

  sendMessage() {}
}
