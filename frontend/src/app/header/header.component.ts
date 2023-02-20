import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  errorMsg: string = '';
  successMsg: any = false;
  cartCount: number = 0;
  @Input() searchBarHide: boolean = false;

  username: string = '';
  email: string = '';
  //login group
  loginForm = this.fb.group({
    //array
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ],
    ],
    password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  //register form group
  registerForm = this.fb.group({
    //array
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ],
    ],
    password: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  //login
  login() {
    if (this.loginForm.valid) {
      // alert('valid');
      let email = this.loginForm.value.email;
      let password = this.loginForm.value.password;

      //login api call
      this.api.login(email, password).subscribe(
        (result: any) => {
          //success
          console.log(result);

          // alert(result.message);
          this.successMsg = true;
          // store username in localstorage
          localStorage.setItem('username', result.username);
          localStorage.setItem('email', result.email);
          localStorage.setItem('wishlist', JSON.stringify(result.wishlist));
          localStorage.setItem('cart', JSON.stringify(result.cart));
          localStorage.setItem('checkout', JSON.stringify(result.checkout));
          // store token in localstorage
          localStorage.setItem('token', result.token);

          setTimeout(() => {
            // navigate dashboard
            window.location.reload();
          }, 2000);
        },
        // client error
        (result: any) => {
          this.errorMsg = result.error.message;
          setTimeout(() => {
            this.errorMsg = '';
            this.loginForm.reset();
          }, 3000);
        }
      );
    } else {
      alert('invalid inputs');
    }
  }

  // register
  register() {
    if (this.registerForm.valid) {
      let username = this.registerForm.value.username;
      let email = this.registerForm.value.email;
      let password = this.registerForm.value.password;
      this.api.register(username, email, password).subscribe(
        (result: any) => {
          //success
          alert(result.message);
          this.registerForm.reset();
          window.location.reload();
        },
        // client error
        (result: any) => {
          alert(result.error.message);
        }
      );
    } else {
      alert('invalid Input');
    }
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.api.cartCount.subscribe((data: any) => {
      this.cartCount = data.length;
    });
  }

  search(event: any) {
    this.searchTerm = event.target.value;

    this.api.searchKey.next(this.searchTerm.trim());
  }
}
