import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  email: string = '';
  cart: number[] = [];
  wishlist: number[] = [];
  products: any[] = [];
  allProducts: any[] = [];
  searchItem: string = '';
  wishlistStatus: boolean = false;

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.wishlist = this.api.apiWishlist;
    this.products = this.api.products;
    if (this.email) {
      this.getMyItems();
      this.allProducts = JSON.parse(localStorage.getItem('products') || '');
    }

    // search
    this.api.searchKey.subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.searchItem = result;
      } else {
        this.searchItem = result;
      }
    });
  }

  removeFromWishlist(productId: any) {
    this.api.removeFromWishlist(this.email, productId).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.api.wishlistMsg = result.message;
        const index = this.wishlist.indexOf(productId);
        this.wishlist.splice(index, 1);
        this.getMyItems();
      },
      // error msg
      (result: any) => {
        console.log(result);
      }
    );
  }

  addToCart(productId: any, count: any) {
    this.api.addToCart(this.email, productId, count).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.getMyItems();

        // // this.wishlistMsg = result.message;
        // this.api.wishlistMsg = result.message;
        // this.getMyItems();
        // setTimeout(() => {
        //   // this.wishlistMsg = '';
        // }, 5000);
      },
      // error msg
      (result: any) => {
        // this.wishlistMsg = result.error.message;
        console.log(result);
      }
    );
  }

  removeFromCart(productId: any) {
    this.api.removeFromCart(this.email, productId).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.api.wishlistMsg = result.message;

        const index = this.cart.indexOf(productId);
        this.cart.splice(index, 1);
        this.getMyItems();
      },
      // error msg
      (result: any) => {
        console.log(result);
      }
    );
  }

  getMyItems() {
    this.api.getWishlist(this.email).subscribe(
      (result: any) => {
        this.wishlistStatus = result.wishlist.length != 0;
        console.log(this.wishlistStatus);

        let productIds: any[] = [];
        let wishlistNew: number[] = [];
        productIds = result.wishlist;

        console.log(result);
        productIds.forEach((item) => wishlistNew.push(item.productId));
        this.wishlist = wishlistNew;
        this.api.apiWishlist = wishlistNew;
        console.log(wishlistNew);

        this.products = [];
        this.wishlist.map((i: any) => {
          this.allProducts.forEach((product: any) => {
            if (product['id'] == i) {
              this.products.push(product);
            }
          });
        });

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
        console.log(this.products);
      },
      (result: any) => {
        console.log(result);
      }
    );
  }
}
