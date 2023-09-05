import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CompteCommissionService,
  CompteCommissionPopupService,
  CompteCommissionComponent,
  CompteCommissionDetailComponent,
  CompteCommissionDialogComponent,
  CompteCommissionPopupComponent,
  CompteCommissionDeletePopupComponent,
  CompteCommissionDeleteDialogComponent,
  compteCommissionRoute,
  compteCommissionPopupRoute,
  CompteCommissionResolvePagingParams
} from '.';

const ENTITY_STATES = [...compteCommissionRoute, ...compteCommissionPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CompteCommissionComponent,
    CompteCommissionDetailComponent,
    CompteCommissionDialogComponent,
    CompteCommissionDeleteDialogComponent,
    CompteCommissionPopupComponent,
    CompteCommissionDeletePopupComponent
  ],
  entryComponents: [
    CompteCommissionComponent,
    CompteCommissionDialogComponent,
    CompteCommissionPopupComponent,
    CompteCommissionDeleteDialogComponent,
    CompteCommissionDeletePopupComponent
  ],
  providers: [
    CompteCommissionService,
    CompteCommissionPopupService,
    CompteCommissionResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCompteCommissionModule {}
