import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  email: string = '';
  wishlist: number[] = [];
  products: any[] = [];

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.wishlist = this.api.apiWishlist;
    this.products = this.api.products;

    console.log(this.api.products);
  }
}
