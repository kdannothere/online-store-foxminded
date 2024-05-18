import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { ShopDataService } from '../../services/shop-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
	products: any[] = [];

	constructor(private shopDataService: ShopDataService) {}

	ngOnInit(): void {
    this.shopDataService.getAllProducts().subscribe((items) => {
      this.products = items;
    });
  }
}
