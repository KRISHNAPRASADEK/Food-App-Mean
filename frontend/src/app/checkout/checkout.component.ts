import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Router } from '@angular/router';

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
  checkoutValid: any = false;
  name: string = '';
  email: string = '';
  emailID: string = '';
  mobile: string = '';
  address: string = '';
  transactionID: string = '';
  orderID: string = '';
  status: string = '';
  detailes: any = {};
  dateAndTime: string = '';
  btnprintHide: boolean = false;
  checkoutIds: any = [];

  public payPalConfig?: IPayPalConfig;

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
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.products = JSON.parse(localStorage.getItem('checkout') || '');
    if (this.products.length == 0) {
      this.router.navigateByUrl('/view-cart');
    }
    console.log(this.products);
    this.api.cartCount.next(this.products);
    this.products.map((product: any) => {
      this.total += product.price;
    });

    // paypal
    this.initConfig();
  }
  checkout() {
    if (this.checkoutForm.valid) {
      this.checkoutValid = true;
      this.name = this.checkoutForm.value.name || '';
      this.emailID = this.checkoutForm.value.email || '';
      this.mobile = this.checkoutForm.value.mobile || '';
      this.address = this.checkoutForm.value.address || '';
    } else {
      alert('inavlid inputs');
    }
  }

  printBill() {
    this.btnprintHide = true;
    setTimeout(() => {
      window.print();
      this.btnprintHide = false;
    }, 1000);
  }

  // paypal integration
  private initConfig(): void {
    const amount = JSON.stringify(this.total);
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'secretid',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          application_context: {
            shipping_preference: 'NO_SHIPPING',
          },
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: amount,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: amount,
                  },
                },
              },
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        // console.log(
        //   'onApprove - transaction was approved, but not authorized',
        //   data,
        //   actions
        // );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
          this.transactionID = details.id;
          this.orderID = Math.random().toString(36).substring(2, 12);
          let date = details.create_time;
          this.dateAndTime = new Date(date).toString();
          this.status = 'Paid';
          this.detailes = {
            name: this.name,
            mobile: this.mobile,
            email: this.emailID,
            address: this.address,
          };
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );

        this.api
          .addToCheckout(
            this.email,
            this.orderID,
            this.transactionID,
            this.dateAndTime,
            this.total,
            this.status,
            this.products,
            this.detailes
          )
          .subscribe(
            // success case
            (result: any) => {
              console.log(result);
              this.successMsg = true;
              this.api.emptyCart(this.email).subscribe(
                // success case
                (result: any) => {
                  console.log(result);
                  this.api.wishlistMsg = result.message;

                  this.api.cartCount.next([]);
                },
                // error msg
                (result: any) => {
                  console.log(result);
                }
              );
            },
            // error msg
            (result: any) => {
              console.log('error: ', result);
              this.errorMsg = 'Payment Failed';
            }
          );
      },
      onCancel: (data) => {
        console.log('OnCancel', data.orderID);
        this.checkoutValid = false;
        this.errorMsg = 'Payment Cancelled';
      },
      onError: (err) => {
        console.log('OnError', err);
        this.errorMsg = 'Payment Failed';
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
