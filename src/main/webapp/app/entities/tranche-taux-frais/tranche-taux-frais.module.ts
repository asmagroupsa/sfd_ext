import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TrancheTauxFraisService,
  TrancheTauxFraisPopupService,
  TrancheTauxFraisComponent,
  TrancheTauxFraisDetailComponent,
  TrancheTauxFraisDialogComponent,
  TrancheTauxFraisPopupComponent,
  TrancheTauxFraisDeletePopupComponent,
  TrancheTauxFraisDeleteDialogComponent,
  trancheTauxFraisRoute,
  trancheTauxFraisPopupRoute,
  TrancheTauxFraisResolvePagingParams
} from '.';

const ENTITY_STATES = [...trancheTauxFraisRoute, ...trancheTauxFraisPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TrancheTauxFraisComponent,
    TrancheTauxFraisDetailComponent,
    TrancheTauxFraisDialogComponent,
    TrancheTauxFraisDeleteDialogComponent,
    TrancheTauxFraisPopupComponent,
    TrancheTauxFraisDeletePopupComponent
  ],
  entryComponents: [
    TrancheTauxFraisComponent,
    TrancheTauxFraisDialogComponent,
    TrancheTauxFraisPopupComponent,
    TrancheTauxFraisDeleteDialogComponent,
    TrancheTauxFraisDeletePopupComponent
  ],
  providers: [
    TrancheTauxFraisService,
    TrancheTauxFraisPopupService,
    TrancheTauxFraisResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTrancheTauxFraisModule {}
