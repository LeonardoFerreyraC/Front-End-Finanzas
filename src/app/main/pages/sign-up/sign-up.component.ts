import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signUpForm:FormGroup;
  showError = false;
  constructor(private router: Router,
              public authService: AuthenticationService,
              public builder: FormBuilder) {
    this.signUpForm = this.builder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  value = "Sign-Up"
  get email() {return this.signUpForm.controls['email'];}
  get password() {return this.signUpForm.controls['password'];}
  get name() {return this.signUpForm.controls['name'];}
  get lastName() {return this.signUpForm.controls['lastName'];}

  signUp(){
    if(!this.name.errors && !this.lastName.errors && !this.email.errors && !this.password.errors)
      this.authService.signIn(this.email.value).subscribe(
        data => {
          this.showError = true;
        },
        error => {
          if (error.status === 400) {
            this.authService.signUp(this.signUpForm.value).subscribe(() =>{
              this.signUpForm.reset();
              this.goToSignIn();
            });
          }
        });
  }
  goToSignIn(){
    this.router.navigate(['/signIn']);
  }
}
