import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CreditRequestStatusService,
  CreditRequestStatusPopupService,
  CreditRequestStatusComponent,
  CreditRequestStatusDetailComponent,
  CreditRequestStatusDialogComponent,
  CreditRequestStatusPopupComponent,
  CreditRequestStatusDeletePopupComponent,
  CreditRequestStatusDeleteDialogComponent,
  creditRequestStatusRoute,
  creditRequestStatusPopupRoute,
  CreditRequestStatusResolvePagingParams
} from '.';

const ENTITY_STATES = [
  ...creditRequestStatusRoute,
  ...creditRequestStatusPopupRoute
];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CreditRequestStatusComponent,
    CreditRequestStatusDetailComponent,
    CreditRequestStatusDialogComponent,
    CreditRequestStatusDeleteDialogComponent,
    CreditRequestStatusPopupComponent,
    CreditRequestStatusDeletePopupComponent
  ],
  entryComponents: [
    CreditRequestStatusComponent,
    CreditRequestStatusDialogComponent,
    CreditRequestStatusPopupComponent,
    CreditRequestStatusDeleteDialogComponent,
    CreditRequestStatusDeletePopupComponent
  ],
  providers: [
    CreditRequestStatusService,
    CreditRequestStatusPopupService,
    CreditRequestStatusResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCreditRequestStatusModule {}
