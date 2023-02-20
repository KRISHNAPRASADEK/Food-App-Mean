import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit {
  productId: any;
  product: any;
  email: string = '';
  wishlistMsg: string = '';

  wishlist: number[] = [];
  cart: number[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService
  ) {}
  ngOnInit(): void {
    // fetch path parameter from url
    this.activatedRoute.params.subscribe((data: any) => {
      console.log(data['id']);
      this.productId = data['id'];
    });
    // to get detailes of requested product
    this.api.viewProduct(this.productId).subscribe((result: any) => {
      this.product = result.product;
    });

    this.email = localStorage.getItem('email') || '';
    this.wishlist = this.api.apiWishlist;
    this.cart = this.api.apiCart;
    if (this.email) {
      this.getMyItems();
    }
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

  addToCart(productId: any) {
    this.api.addToCart(this.email, productId, 1).subscribe(
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

  removeFromCart(productId: any) {
    this.api.removeFromCart(this.email, productId).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.wishlistMsg = result.message;
        this.api.wishlistMsg = result.message;

        const index = this.cart.indexOf(productId);
        this.cart.splice(index, 1);
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
        console.log(result);

        let cartproductIds: any[] = [];
        let cartNew: number[] = [];
        cartproductIds = result.cart;
        cartproductIds = result.cart;
        cartproductIds.forEach((item) => cartNew.push(item.productId));
        this.cart = cartNew;
        this.api.apiCart = cartNew;
        this.api.cartCount.next(cartNew);
        this.wishlist = [];
        result.wishlist.map((i: any) => {
          this.wishlist.push(i.productId);
        });

        localStorage.setItem('username', result.username);
        localStorage.setItem('email', result.email);
        localStorage.setItem('wishlist', JSON.stringify(result.wishlist));
        localStorage.setItem('cart', JSON.stringify(result.cart));
        localStorage.setItem('token', result.token);
      },
      (result: any) => {
        console.log(result.error.message);
      }
    );
  }
}
