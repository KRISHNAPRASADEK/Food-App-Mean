import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  products: any[] = [];
  total: number = 0;
  errorMsg: string = '';
  successMsg: any = false;
  //login group
  checkoutForm = this.fb.group({
    //array
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ],
    ],
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    address: [
      '',
      [Validators.required, Validators.pattern('[a-zA-Z0-9(),. ]*')],
    ],
    mobile: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });
  constructor(private api: ApiService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.products = JSON.parse(localStorage.getItem('checkout') || '');
    console.log(this.products);
    this.api.cartCount.next(this.products);
    this.products.map((product: any) => {
      this.total += product.price;
    });
  }
  checkout() {
    if (this.checkoutForm.valid) {
      alert('payment successful');
      this.checkoutForm.reset();
    } else {
      alert('inavlid inputs');
    }
  }
}
