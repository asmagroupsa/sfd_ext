import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { CreditRequestService } from '../credit-request/credit-request.service';
import {
  GarantieService,
  GarantiePopupService,
  GarantieComponent,
  GarantieDetailComponent,
  GarantieDialogComponent,
  GarantiePopupComponent,
  GarantieDeletePopupComponent,
  GarantieDeleteDialogComponent,
  garantieRoute,
  garantiePopupRoute,
  GarantieResolvePagingParams
} from '.';

const ENTITY_STATES = [...garantieRoute, ...garantiePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    GarantieComponent,
    GarantieDetailComponent,
    GarantieDialogComponent,
    GarantieDeleteDialogComponent,
    GarantiePopupComponent,
    GarantieDeletePopupComponent
  ],
  entryComponents: [
    GarantieComponent,
    GarantieDialogComponent,
    GarantiePopupComponent,
    GarantieDeleteDialogComponent,
    GarantieDeletePopupComponent
  ],
  providers: [
    CreditRequestService,
    GarantieService,
    GarantiePopupService,
    GarantieResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdGarantieModule {}
