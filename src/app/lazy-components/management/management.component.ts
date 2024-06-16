import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [],
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent {
	goToAddNewProduct() {
		this.router.navigate(['/management/add-new-product']);
	}
	goToEditDeleteProduct() {
		this.router.navigate(['/management/edit-delete-product']);
	}

	constructor(private router: Router){}
}
