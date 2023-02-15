import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any = [];
  searchItem: string = '';
  email: string = '';
  username: string = '';
  wishlistMsg: string = '';
  wishlist: number[] = [];
  cart: number[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.username = localStorage.getItem('username') || '';

    if (this.email) {
      this.getMyItems();
    }

    this.api.getAllProducts().subscribe((result: any) => {
      this.products = result.products;
      this.api.products = result.products;
      localStorage.setItem('products', JSON.stringify(result.products));
      console.log(this.products);
    });

    this.api.searchKey.subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.searchItem = result;
      } else {
        this.searchItem = result;
      }
    });
  }

  addToWishlist(productId: any) {
    this.api.addToWishlist(this.email, productId).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.wishlistMsg = result.message;
        this.api.wishlistMsg = result.message;
        this.getMyItems();
        setTimeout(() => {
          this.wishlistMsg = '';
        }, 5000);
      },
      // error msg
      (result: any) => {
        this.wishlistMsg = result.error.message;
      }
    );
  }

  removeFromWishlist(productId: any) {
    this.api.removeFromWishlist(this.email, productId).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.wishlistMsg = result.message;
        this.api.wishlistMsg = result.message;
        const index = this.wishlist.indexOf(productId);
        this.wishlist.splice(index, 1);
        this.getMyItems();
        setTimeout(() => {
          this.wishlistMsg = '';
        }, 5000);
      },
      // error msg
      (result: any) => {
        this.wishlistMsg = result.error.message;
      }
    );
  }

  getMyItems() {
    this.api.getWishlist(this.email).subscribe(
      (result: any) => {
        let productIds: any[] = [];
        let wishlistNew: number[] = [];
        productIds = result.wishlist;
        console.log(result);
        productIds.forEach((item) => wishlistNew.push(item.productId));
        this.wishlist = wishlistNew;
        this.api.apiWishlist = wishlistNew;

        let cartproductIds: any[] = [];
        let cartNew: number[] = [];
        cartproductIds = result.cart;
        cartproductIds = result.cart;
        cartproductIds.forEach((item) => cartNew.push(item.productId));
        this.cart = cartNew;

        this.api.apiCart = cartNew;
        this.api.cartCount.next(cartNew);

        localStorage.setItem('username', result.username);
        localStorage.setItem('email', result.email);
        localStorage.setItem('wishlist', JSON.stringify(result.wishlist));
        localStorage.setItem('cart', JSON.stringify(result.cart));
        localStorage.setItem('token', result.token);

        this.router.navigateByUrl('');
      },
      (result: any) => {
        console.log(result.error.message);
      }
    );
  }
}
