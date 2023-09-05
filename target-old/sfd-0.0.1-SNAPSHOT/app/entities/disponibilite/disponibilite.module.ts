import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { LoginComityComponent } from './login-comity/login-comity.component';
import { ComityPipe, PresencePipe } from './pipe';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import {
  DisponibiliteService,
  DisponibilitePopupService,
  DisponibiliteComponent,
  DisponibiliteDetailComponent,
  DisponibiliteDialogComponent,
  DisponibilitePopupComponent,
  DisponibiliteDeletePopupComponent,
  DisponibiliteDeleteDialogComponent,
  disponibiliteRoute,
  disponibilitePopupRoute,
  DisponibiliteResolvePagingParams
} from '.';
import { ComityMberService } from '../comity-mber/comity-mber.service';
import { DelegatedMemberService } from '../delegated-member/delegated-member.service';

const ENTITY_STATES = [...disponibiliteRoute, ...disponibilitePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DisponibiliteComponent,
    DisponibiliteDetailComponent,
    DisponibiliteDialogComponent,
    DisponibiliteDeleteDialogComponent,
    DisponibilitePopupComponent,
    DisponibiliteDeletePopupComponent,
    LoginComityComponent,
    ComityPipe,
    PresencePipe
  ],
  entryComponents: [
    DisponibiliteComponent,
    DisponibiliteDialogComponent,
    DisponibilitePopupComponent,
    DisponibiliteDeleteDialogComponent,
    DisponibiliteDeletePopupComponent
  ],
  providers: [
    CreditComityService,
    ComityMberService,
    DelegatedMemberService,
    DisponibiliteService,
    DisponibilitePopupService,
    DisponibiliteResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDisponibiliteModule {}
