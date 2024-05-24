import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { Page404Component } from './components/page-404/page-404.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
	{ path: 'products/:productId', component: ProductDetailsComponent },
  { path: 'contact', component: ContactComponent },
	{ path: '404', component: Page404Component },
  { path: '**', component: Page404Component },
];
