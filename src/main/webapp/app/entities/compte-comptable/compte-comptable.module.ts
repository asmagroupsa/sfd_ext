import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CompteComptableService,
  PeriodicityPopupService,
  PeriodicityComponent,
  PeriodicityDetailComponent,
  CompteComptableDialogComponent,
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
    CompteComptableDialogComponent,
    PeriodicityDeleteDialogComponent,
    PeriodicityPopupComponent,
    PeriodicityDeletePopupComponent
  ],
  entryComponents: [
    PeriodicityComponent,
    CompteComptableDialogComponent,
    PeriodicityPopupComponent,
    PeriodicityDeleteDialogComponent,
    PeriodicityDeletePopupComponent
  ],
  providers: [
    CompteComptableService,
    PeriodicityPopupService,
    PeriodicityResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCompteComptableModule {}
