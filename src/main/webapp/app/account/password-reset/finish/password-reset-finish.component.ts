import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef
} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

import { PasswordResetFinishService } from './password-reset-finish.service';
import { LoginModalService } from '../../../shared';
import { LanguesService } from '../../../shared/myTranslation/langues';

@Component({
  selector: 'jhi-password-reset-finish',
  templateUrl: './password-reset-finish.component.html'
})
export class PasswordResetFinishComponent implements OnInit, AfterViewInit {
  confirmPassword: string;
  doNotMatch: string;
  error: string;
  keyMissing: boolean;
  resetAccount: any;
  success: string;
  modalRef: NgbModalRef;
  key: string;

  constructor(
    private passwordResetFinishService: PasswordResetFinishService,
    private loginModalService: LoginModalService,
    private route: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public langue: LanguesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
    });
    this.resetAccount = {};
    this.keyMissing = !this.key;
  }

  ngAfterViewInit() {
    if (this.elementRef.nativeElement.querySelector('#password') != null) {
      /* this.renderer.invokeElementMethod(
        this.elementRef.nativeElement.querySelector('#password'),
        'focus',
        []
      ); */
      this.elementRef.nativeElement.querySelector('#password').focus();
    }
  }

  finishReset() {
    this.doNotMatch = null;
    this.error = null;
    if (this.resetAccount.password !== this.confirmPassword) {
      this.doNotMatch = 'ERROR';
    } else {
      this.passwordResetFinishService
        .save({ key: this.key, newPassword: this.resetAccount.password })
        .subscribe(
          () => {
            this.success = 'OK';
          },
          () => {
            this.success = null;
            this.error = 'ERROR';
          }
        );
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
}
