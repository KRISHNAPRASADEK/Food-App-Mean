import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  email: string = '';
  cartItemCount: number = 0;
  total: number = 0;
  cart: number[] = [];
  products: any[] = [];
  updatedProducts: any[] = [];
  allProducts: any[] = [];
  price: number = 0;
  productsIds: number[] = [];
  select: number[] = [1, 2, 3, 4];

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';

    if (this.email) {
      this.getMyItems();
    }
    this.allProducts = JSON.parse(localStorage.getItem('products') || '');

    // if (localStorage.getItem('products')) {
    // }

    // this.products = this.api.products;

    console.log(this.products);

    // localStorage.setItem('myCart', JSON.stringify(this.products));
    // console.log(this.products);
  }

  getMyItems() {
    this.api.getWishlist(this.email).subscribe(
      (result: any) => {
        console.log(result);

        let cartproductIds: any[] = [];
        let cartNew: number[] = [];
        cartproductIds = result.cart;
        cartproductIds.forEach((item) => cartNew.push(item.productId));
        this.cart = cartproductIds;

        this.products = [];
        this.allProducts.map((item: any) => {
          if (item.normalPrice == undefined) {
            item.normalPrice = item.price;
          }
        });
        this.cart.map((i: any) => {
          this.allProducts.forEach((product: any) => {
            if (product['id'] == i.productId) {
              product.count = i.count;
              product.price = product.normalPrice * i.count;

              this.products.push(product);
            }
          });
        });
        // console.log(this.cart);
        this.cart = this.cart;
        this.products = this.products;
        this.total = 0;
        this.products.map((product: any) => {
          this.total += product.price;
        });
        this.total = Number(this.total.toFixed(2));

        localStorage.setItem('checkout', JSON.stringify(this.products));

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
        console.log(result.error.message);
      }
    );
  }
  onChange(value: any, productId: any) {
    this.cartItemCount = value.target.value;
    console.log(this.cartItemCount);

    this.addToCart(productId, this.cartItemCount);
  }

  addToCart(productId: any, count: any) {
    this.api.updateCartItemCount(this.email, productId, count).subscribe(
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
        console.log(result.error.message);
      }
    );
  }
  emptyCart(email: any) {
    this.api.emptyCart(email).subscribe(
      // success case
      (result: any) => {
        console.log(result);
        this.api.wishlistMsg = result.message;
        this.cart = [];

        this.getMyItems();
      },
      // error msg
      (result: any) => {
        console.log(result);
      }
    );
  }
}
