import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-discount-timer',
  standalone: true,
  template: `<span>{{ remainingTime }}</span>`,
})
export class DiscountTimerComponent implements OnInit {
  @Input() discountUntil!: string;

  remainingTime: string = '';

  private timerSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    const futureDate = new Date(this.discountUntil);
		this.updateRemainingTime(futureDate);
    if (isNaN(futureDate.getTime())) {
      console.error('Invalid date for discountUntil');
      this.remainingTime = 'Invalid date';
      return;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateRemainingTime(futureDate);
    });
  }

  private updateRemainingTime(targetDate: Date): void {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff < 0) {
      this.remainingTime = 'Discount expired';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;
    this.remainingTime = formattedTime;
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
