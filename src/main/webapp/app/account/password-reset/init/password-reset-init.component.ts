import {
  Component,
  OnInit,
  AfterViewInit,
  Renderer2,
  ElementRef
} from '@angular/core';

import { PasswordResetInitService } from './password-reset-init.service';
import { LanguesService } from '../../../shared/myTranslation/langues';

@Component({
  selector: 'jhi-password-reset-init',
  templateUrl: './password-reset-init.component.html'
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
  error: string;
  errorEmailNotExists: string;
  resetAccount: any;
  success: string;

  constructor(
    private passwordResetInitService: PasswordResetInitService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public langue: LanguesService
  ) {}

  ngOnInit() {
    this.resetAccount = {};
  }

  ngAfterViewInit() {
    /* this.renderer.invokeElementMethod(
      this.elementRef.nativeElement.querySelector('#email'),
      'focus',
      []
    ); */
    this.elementRef.nativeElement.querySelector('#email').focus();
  }

  requestReset() {
    this.error = null;
    this.errorEmailNotExists = null;

    this.passwordResetInitService.save(this.resetAccount.email).subscribe(
      () => {
        this.success = 'OK';
      },
      response => {
        this.success = null;
        if (
          response.status === 400 &&
          response.data === 'email address not registered'
        ) {
          this.errorEmailNotExists = 'ERROR';
        } else {
          this.error = 'ERROR';
        }
      }
    );
  }
}
