import { Component, Input } from '@angular/core';
import { Review } from '../../models/review';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
	@Input() review!: Review;
	private imageFolderPath = '/assets/images/';

	get ratingImage(): string {
		const  rating: number = this.review.rating;
    switch (true) {
      case rating === 2:
        return this.imageFolderPath + 'stars-2.png';
      case rating === 3:
        return this.imageFolderPath + 'stars-3.png';
      case rating === 4:
        return this.imageFolderPath + 'stars-4.png';
      case rating === 5:
        return this.imageFolderPath + 'stars-5.png';
      default:
        return this.imageFolderPath + 'stars-1.png';
    }
  }
}
