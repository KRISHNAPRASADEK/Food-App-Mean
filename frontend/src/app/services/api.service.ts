import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const options = {
  headers: new HttpHeaders(),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // to hold search key from header component
  searchKey = new BehaviorSubject('');
  wishlistMsg: string = '';
  apiWishlist: number[] = [];
  apiCart: number[] = [];
  products: any[] = [];
  cartCount = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  //register
  register(username: any, email: any, password: any) {
    const body = {
      username,
      email,
      password,
    };
    // server call to register an account and return response to register component
    return this.http.post('http://localhost:3000/register', body);
  }

  //login
  login(email: any, password: any) {
    const body = {
      email,
      password,
    };
    // server call to register an account and return response to login component
    return this.http.post('http://localhost:3000/login', body);
  }

  //all products api
  getAllProducts() {
    return this.http.get('http://localhost:3000/all-products');
  }

  //view products api
  viewProduct(productId: any) {
    return this.http.get('http://localhost:3000/view-product/' + productId);
  }

  // appending token to http headee
  appendToken() {
    // fetch token from local Storage
    const token = localStorage.getItem('token') || '';
    // create http header
    let headers = new HttpHeaders();
    if (token) {
      //append token inside http headers
      headers = headers.append('access-token', token);
      options.headers = headers;
    }
    return options;
  }

  //addTowishlist
  addToWishlist(email: any, productId: any) {
    const body = {
      email,
      productId,
    };
    return this.http.post(
      'http://localhost:3000/addToWishlist/',
      body,
      this.appendToken()
    );
  }

  //remove from wishlist
  removeFromWishlist(email: any, productId: any) {
    const body = {
      email,
      productId,
    };
    return this.http.put(
      'http://localhost:3000/removeFromWishlist/',
      body,
      this.appendToken()
    );
  }

  //addToCart
  addToCart(email: any, productId: any, count: any) {
    const body = {
      email,
      productId,
      count,
    };
    return this.http.post(
      'http://localhost:3000/addToCart/',
      body,
      this.appendToken()
    );
  }

  //addToCart
  updateCartItemCount(email: any, productId: any, count: any) {
    const body = {
      email,
      productId,
      count,
    };
    return this.http.put(
      'http://localhost:3000/updateCartItemCount/',
      body,
      this.appendToken()
    );
  }

  //remove from cart
  removeFromCart(email: any, productId: any) {
    const body = {
      email,
      productId,
    };
    return this.http.put(
      'http://localhost:3000/removeFromCart/',
      body,
      this.appendToken()
    );
  }

  //remove from cart
  emptyCart(email: any) {
    const body = {
      email,
    };
    return this.http.put(
      'http://localhost:3000/emptyCart/',
      body,
      this.appendToken()
    );
  }
  // create_time: '2023-02-20T05:19:08Z';
  // id: '2NF61948LD649100D';

  //addToCheckout
  addToCheckout(
    email: any,
    orderID: any,
    transactionID: any,
    dateAndTime: any,
    amount: any,
    status: any,
    products: any,
    detailes: any
  ) {
    const body = {
      email,
      orderID,
      transactionID,
      dateAndTime,
      amount,
      status,
      products,
      detailes,
    };
    return this.http.post(
      'http://localhost:3000/addToCheckout/',
      body,
      this.appendToken()
    );
  }

  getWishlist(email: any) {
    return this.http.get(
      'http://localhost:3000/getWishlist/' + email,
      this.appendToken()
    );
  }
  getMyOrders(email: any) {
    return this.http.get(
      'http://localhost:3000/getMyOrders/' + email,
      this.appendToken()
    );
  }
}
