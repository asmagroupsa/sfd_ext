import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TauxCommissionService,
  TauxCommissionPopupService,
  TauxCommissionComponent,
  TauxCommissionDetailComponent,
  TauxCommissionDialogComponent,
  TauxCommissionPopupComponent,
  TauxCommissionDeletePopupComponent,
  TauxCommissionDeleteDialogComponent,
  tauxCommissionRoute,
  tauxCommissionPopupRoute,
  TauxCommissionResolvePagingParams
} from '.';

const ENTITY_STATES = [...tauxCommissionRoute, ...tauxCommissionPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TauxCommissionComponent,
    TauxCommissionDetailComponent,
    TauxCommissionDialogComponent,
    TauxCommissionDeleteDialogComponent,
    TauxCommissionPopupComponent,
    TauxCommissionDeletePopupComponent
  ],
  entryComponents: [
    TauxCommissionComponent,
    TauxCommissionDialogComponent,
    TauxCommissionPopupComponent,
    TauxCommissionDeleteDialogComponent,
    TauxCommissionDeletePopupComponent
  ],
  providers: [
    TauxCommissionService,
    TauxCommissionPopupService,
    TauxCommissionResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTauxCommissionModule {}
