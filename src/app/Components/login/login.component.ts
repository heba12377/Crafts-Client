import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/auth/auth.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/Services/user.service';
export class User {
  name!: string;
  password!: string;
  email!: string;
  gender!: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private accservices: LoginService,
    private fb: FormBuilder,
    private userServ: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  loginObj: any = {
    email: '',
    password: '',
  };

  isLoading = false;

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    this.isLoading = true;
    this.accservices.onLogin(this.loginObj).subscribe(
      (res: any) => {
        console.log('res', res);
        if (this.userServ.isUpdated === false) {
          //if true set all data with edited name, mail
          if (res.user.gender == 0) {
            localStorage.setItem('gender', 'Male');
          } else {
            localStorage.setItem('gender', 'Female');
          }
          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.user.id);
          localStorage.setItem('name', res.user.userName);
          localStorage.setItem('mail', res.user.email);
          localStorage.setItem('password', res.user.password);
          localStorage.setItem('gender', res.user.gender);
          localStorage.setItem('image', res.user.image);
          localStorage.setItem('cart', res.user.cart);
          localStorage.setItem('user', JSON.stringify(res));
        } else {
          //if false, dont set the name, mail with new ones, let the old data
          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.id);
          localStorage.setItem('password', res.password);
          localStorage.setItem('gender', res.gender);
        }
        Swal.fire('Thank You...', 'You Login Successfully', 'success');
        this.isLoading = false;
        window.location.reload();
        window.location.assign('/home');
      },
      (err) => {
        Swal.fire('Sorry....', 'Invalid Email or Password', 'error');
        this.isLoading = false;
      }
    );
    console.log(localStorage.getItem('cart'));
  }

  visible: boolean = true;
  changetype: boolean = true;

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
}
