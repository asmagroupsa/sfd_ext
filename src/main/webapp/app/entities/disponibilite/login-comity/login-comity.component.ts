import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Principal } from '../../../shared/auth/principal.service';

@Component({
  selector: 'jhi-login-comity',
  templateUrl: './login-comity.component.html',
  styles: []
})
export class LoginComityComponent implements OnInit {
  @Output() success: EventEmitter<boolean> = new EventEmitter();
  username: string = '';
  password: string = '';

  constructor(private principal: Principal) {}

  ngOnInit() {}
  onLogin() {
    if (this.username && this.password) {
      this.principal.identity().then(identity => {
        if (identity.login == this.username) {
          this.principal.store['loggedComity'] = true;
          this.success.emit(false);
        }
      });
    }
  }
}
