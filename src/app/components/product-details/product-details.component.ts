import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopDataService } from '../../services/shop-data.service';
import { Review } from '../../models/review';
import { Product } from '../../models/product';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CharactersLimitationPipe } from '../../pipes/characters-limitation.pipe';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../review/review.component';
import { FormsModule } from '@angular/forms';
import { PriceService } from '../../services/price.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReviewComponent,
    CharactersLimitationPipe,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnDestroy {
  product: Product | null = null;
  private destroy$ = new Subject<void>();
  private imageFolderPath = '/assets/images/';
  private minDescriptionLimit: number = 190;
  private maxDescriptionLimit: number = 2000;
  descriptionLimit: number = this.minDescriptionLimit;
  activeImage: string = '';
  readMore: boolean = true;
  ratingValue: number = 5;
  ratingImageUrl: string = this.getImageByRating(this.ratingValue);
  nameFieldValue: string = '';
  reviewFieldValue: string = '';
  nameFieldMaxLength = 50;
  reviewFieldMaxLength = 2000;

  constructor(
    public priceService: PriceService,
    private shopDataService: ShopDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  hideReadMore() {
    this.descriptionLimit = this.maxDescriptionLimit;
    this.readMore = false;
  }

  showReadMore() {
    this.descriptionLimit = this.minDescriptionLimit;
    this.readMore = true;
  }

  get readLess(): boolean {
    return !this.readMore && this.description.length > this.minDescriptionLimit;
  }

  get url(): string {
    return '/products/' + ((this.product && this.product.id) || 0);
  }

  changeActiveImage(imageUrl: string) {
    this.activeImage = imageUrl;
  }

  get description(): string {
    if (!this.product) {
      return '';
    }
    return this.product.description;
  }

  get price(): number {
    if (!this.product) {
      return 0;
    }
    return this.product.price;
  }

  get discount(): number {
    if (!this.product) {
      return 0;
    }
    return this.product.discount;
  }

  get discountUntil(): string {
    if (!this.product) {
      return '';
    }
    return this.product.discountUntil;
  }

  get reviewAmount(): number {
    if (!this.product) {
      return 0;
    }
    return this.product.review.length;
  }

  get colorRow(): string {
    if (!this.product) {
      return '';
    }
    return this.product.color.join('/');
  }

  get colors(): string[] {
    return (this.product && this.product.color) || [];
  }

  get sizes(): string[] {
    return (this.product && this.product.size) || [];
  }

  private getMedianRating(product: Product): number {
    if (product.review.length === 0) return 0;
    let sumOfRatings = 0;
    product.review.forEach((review) => {
      sumOfRatings += review.rating;
    });
    return sumOfRatings / product.review.length;
  }

  getRatingImage(): string {
    if (!this.product) return this.imageFolderPath + 'stars-0.png';
    const medianRating = this.getMedianRating(this.product);
    return this.getImageByRating(medianRating);
  }

  getImageByRating(rating: number): string {
    switch (true) {
      case rating >= 1 && rating < 2:
        return this.imageFolderPath + 'stars-1.png';
      case rating >= 2 && rating < 3:
        return this.imageFolderPath + 'stars-2.png';
      case rating >= 3 && rating < 4:
        return this.imageFolderPath + 'stars-3.png';
      case rating >= 4 && rating < 4.9:
        return this.imageFolderPath + 'stars-4.png';
      case rating >= 4.9 && rating < 6:
        return this.imageFolderPath + 'stars-5.png';
      default:
        return this.imageFolderPath + 'stars-0.png';
    }
  }

  changeRatingImage(rating: number) {
    this.ratingImageUrl = this.getImageByRating(rating);
    this.ratingValue = rating;
  }

  saveReview() {
    const review: Review = {
      author: this.nameFieldValue,
      text: this.reviewFieldValue,
      rating: this.ratingValue,
    };
    this.product?.review.push(review);
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => +params['productId'] as number),
        takeUntil(this.destroy$)
      )
      .subscribe((productId) => this._initProductById(productId));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _initProductById(productId: number) {
    this.shopDataService
      .getProductById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((product) => {
        if (!product) {
          this.redirectPage();
          return;
        }
        this.product = product;
        this.activeImage = product.imgUrl[0] || '';
        this.readMore = product.description.length > 190;
      });
  }

  private redirectPage() {
    this.router.navigate(['/404']);
  }
}
