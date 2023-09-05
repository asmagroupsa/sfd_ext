import { Component, OnInit } from '@angular/core';

import { Principal } from '../../shared';
import { PasswordService } from './password.service';
import { LanguesService } from '../../shared/myTranslation/langues';
import { EventBus } from '../../shared/model/functions';
import {Router} from '@angular/router';
import { LoginService } from '../../shared/login/login.service';
@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit {
  doNotMatch: string;
  isSaving:boolean = false;
  doNotMatchOldPassword:string;
  samePassword:string;
  error: string;
  success: string;
  account: any;
  password: string;
  oldpassword:string;
  confirmPassword: string;


  constructor(
    private passwordService: PasswordService,
    private principal: Principal,
    private router: Router,private loginService: LoginService,
    public langue: LanguesService
  ) {}

  ngOnInit() {
    this.principal.identity().then(account => {
      this.account = account;
    });
  }

  changePassword() {
    this.isSaving = true;
    if(this.principal.credentials.password && this.oldpassword !== this.principal.credentials.password){
      this.doNotMatchOldPassword = 'ERROR';
      this.isSaving = false;
      return ;
    }
    this.doNotMatchOldPassword = null;
    if (this.password !== this.confirmPassword) {
      this.error = null;
      this.success = null;
      this.doNotMatch = 'ERROR';
      this.isSaving = false;
    } else {
      if(this.password === this.oldpassword){
this.error = null;
      this.success = null;
      this.doNotMatch = null;
      this.samePassword = 'ERROR';
      this.isSaving = false;
return ;
      }
      this.doNotMatch = null;
      this.passwordService.save(this.password).subscribe(
        () => {
          this.error = null;
          this.success = 'OK';
          this.logout();
        },
        () => {
          this.success = null;
          this.error = 'ERROR';
          this.isSaving = false;
        }
      );
    }
  }
   logout(state: boolean = false) {
        this.loginService
            .logout(state)
            .then(() => {
                window.localStorage.removeItem('userTime');
                
                EventBus.publish('ressources', {});
                this.router.navigate(['']);
            })
            .catch(e => {
                //
            });
    }
}
