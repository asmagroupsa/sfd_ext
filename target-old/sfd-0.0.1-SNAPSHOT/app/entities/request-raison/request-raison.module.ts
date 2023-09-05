import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  RequestRaisonService,
  RequestRaisonPopupService,
  RequestRaisonComponent,
  RequestRaisonDetailComponent,
  RequestRaisonDialogComponent,
  RequestRaisonPopupComponent,
  RequestRaisonDeletePopupComponent,
  RequestRaisonDeleteDialogComponent,
  requestRaisonRoute,
  requestRaisonPopupRoute,
  RequestRaisonResolvePagingParams
} from '.';

const ENTITY_STATES = [...requestRaisonRoute, ...requestRaisonPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RequestRaisonComponent,
    RequestRaisonDetailComponent,
    RequestRaisonDialogComponent,
    RequestRaisonDeleteDialogComponent,
    RequestRaisonPopupComponent,
    RequestRaisonDeletePopupComponent
  ],
  entryComponents: [
    RequestRaisonComponent,
    RequestRaisonDialogComponent,
    RequestRaisonPopupComponent,
    RequestRaisonDeleteDialogComponent,
    RequestRaisonDeletePopupComponent
  ],
  providers: [
    RequestRaisonService,
    RequestRaisonPopupService,
    RequestRaisonResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRequestRaisonModule {}
