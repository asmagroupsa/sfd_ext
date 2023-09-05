import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  PeriodicityService,
  PeriodicityPopupService,
  PeriodicityComponent,
  PeriodicityDetailComponent,
  PeriodicityDialogComponent,
  PeriodicityPopupComponent,
  PeriodicityDeletePopupComponent,
  PeriodicityDeleteDialogComponent,
  periodicityRoute,
  periodicityPopupRoute,
  PeriodicityResolvePagingParams
} from '.';

const ENTITY_STATES = [...periodicityRoute, ...periodicityPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PeriodicityComponent,
    PeriodicityDetailComponent,
    PeriodicityDialogComponent,
    PeriodicityDeleteDialogComponent,
    PeriodicityPopupComponent,
    PeriodicityDeletePopupComponent
  ],
  entryComponents: [
    PeriodicityComponent,
    PeriodicityDialogComponent,
    PeriodicityPopupComponent,
    PeriodicityDeleteDialogComponent,
    PeriodicityDeletePopupComponent
  ],
  providers: [
    PeriodicityService,
    PeriodicityPopupService,
    PeriodicityResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdPeriodicityModule {}
