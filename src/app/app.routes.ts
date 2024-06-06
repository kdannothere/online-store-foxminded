import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ContactComponent } from './components/contact/contact.component';
import { Page404Component } from './components/page-404/page-404.component';

export const routes: Routes = [
  {
    path: '', // write 'order' later
    loadComponent: () =>
      import('./lazy-components/order/order.component').then(
        (m) => m.OrderComponent
      ),
  },
  { path: 'home', component: HomeComponent },
  { path: 'products/:productId', component: ProductDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: Page404Component },
];
