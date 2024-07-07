import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, interval, map, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-discount-timer',
  standalone: true,
  imports: [CommonModule],
  template: `<span>{{ remainingTime$ | async }}</span>`,
})
export class DiscountTimerComponent implements OnDestroy {
  @Input() discountUntil!: string;

  remainingTime$: Observable<string>;
  private destroy$ = new Subject<void>();

  constructor() {
    this.remainingTime$ = this.createRemainingTimeObservable();
  }

  private createRemainingTimeObservable(): Observable<string> {
    return interval(1000).pipe(
      startWith(this.calculateRemainingTime()),
      map(() => this.calculateRemainingTime()),
      takeUntil(this.destroy$)
    );
  }

  private calculateRemainingTime(): string {
    const futureDate = new Date(this.discountUntil);
    const now = new Date();
    const diff = futureDate.getTime() - now.getTime();

    if (diff < 0) {
      return 'Discount expired';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
	
  ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
  }
}
