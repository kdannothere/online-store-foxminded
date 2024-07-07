import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-field-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './field-input.component.html',
  styleUrl: './field-input.component.scss',
})
export class FieldInputComponent {
  @Input() required: boolean = false;
  @Input() placeholder?: string;
  @Input() type?: 'text' | 'number' | 'email' | 'password';
  @Input() control: FormControl = new FormControl('');
  @ViewChild('inputView') inputView!: ElementRef<HTMLElement>;
  @ViewChild('placeholderView') placeholderView!: ElementRef<HTMLElement>;

  private _class: Set<string> = new Set();
  get class(): string {
    return Array.from(this._class).join(' ');
  }

  private _placeholderClass: Set<string> = new Set('');
  get placeholderClass(): string {
    return Array.from(this._placeholderClass).join(' ');
  }

  focusInput(): void {
    this.inputView.nativeElement.focus();
  }

  validate(): boolean {
    if (this.control.valid) {
      this._class.delete('invalid');
      return true;
    }
    this._class.add('invalid');
    return false;
  }

  animatePlaceholder() {
    if (!this.control.value && (this._placeholderClass.has('animated-down') || !this._placeholderClass.has('up'))) {
			if(this._placeholderClass.has('up')) return;
			this._placeholderClass.clear();
			this._placeholderClass.add('up');
      return;
    }
    if (this._placeholderClass.has('up') && !this.control.value) {
			this._placeholderClass.clear();
			this._placeholderClass.add('down');
      return;
    }
  }
}
