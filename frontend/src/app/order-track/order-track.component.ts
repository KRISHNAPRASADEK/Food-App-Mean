import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-order-track',
  templateUrl: './order-track.component.html',
  styleUrls: ['./order-track.component.css'],
})
export class OrderTrackComponent implements OnInit {
  success: boolean = true;
  email: string = '';
  orders: any = [];
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    if (this.email) {
      this.getMyOrders();
    }
  }
  getMyOrders() {
    this.api.getMyOrders(this.email).subscribe(
      (result: any) => {
        console.log(result);
        this.orders = result.checkout;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
}
