import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared/shared.module';
import {
  DelegationComityService,
  DelegationComityPopupService,
  DelegationComityComponent,
  DelegationComityDetailComponent,
  DelegationComityDialogComponent,
  DelegationComityPopupComponent,
  DelegationComityDeletePopupComponent,
  DelegationComityDeleteDialogComponent,
  delegationComityRoute,
  delegationComityPopupRoute,
  DelegationComityResolvePagingParams
} from '.';
import { DelegationPipe } from './pipe';
import { DelegatedMemberService } from '../delegated-member/delegated-member.service';
const ENTITY_STATES = [...delegationComityRoute, ...delegationComityPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DelegationComityComponent,
    DelegationComityDetailComponent,
    DelegationComityDialogComponent,
    DelegationComityDeleteDialogComponent,
    DelegationComityPopupComponent,
    DelegationComityDeletePopupComponent,
    DelegationPipe
  ],
  entryComponents: [
    DelegationComityComponent,
    DelegationComityDialogComponent,
    DelegationComityPopupComponent,
    DelegationComityDeleteDialogComponent,
    DelegationComityDeletePopupComponent
  ],
  providers: [
    DelegatedMemberService,
    DelegationComityService,
    DelegationComityPopupService,
    DelegationComityResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDelegationComityModule {}
