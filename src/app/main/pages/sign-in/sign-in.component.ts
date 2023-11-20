import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EntryService} from "../../services/entry.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  signInForm: FormGroup
  success: boolean = false
  showError: boolean = false
  existingUser = {}
  constructor(private router: Router,
              private authService: AuthenticationService,
              public builder: FormBuilder,
              private entryService: EntryService){
    this.signInForm = this.builder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    })

  };
  value = "Sign-In"

  get email(){
    return this.signInForm.controls['email']
  }

  get password(){
    return this.signInForm.controls['password']
  }
  signIn(){
    if(!this.email.errors && !this.password.errors){
      this.authService.signIn(this.email.value).subscribe((response: any) =>{
        let user = response
        if(user && user.length > 0){
          user = user[0]
          this.success = user['password'] == this.password.value
          this.existingUser = user
        }
        this.showError = !this.success
        this.success?this.goToHome():''
      })
    }
  }
  goToSignUp(){
    this.router.navigate(['/signUp']);
  }

  goToHome(){
    this.success = false
    return new Promise((resolve) => {
      this.entryService.setUser(this.existingUser);
      resolve(true);
    })
      .then(() => {
        this.router.navigate(['/home/simulator']);
      });
  }


}
