import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TranchePenalSFDService,
  TranchePenalSFDPopupService,
  TranchePenalSFDComponent,
  TranchePenalSFDDetailComponent,
  TranchePenalSFDDialogComponent,
  TranchePenalSFDPopupComponent,
  TranchePenalSFDDeletePopupComponent,
  TranchePenalSFDDeleteDialogComponent,
  tranchePenalSFDRoute,
  tranchePenalSFDPopupRoute,
  TranchePenalSFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...tranchePenalSFDRoute, ...tranchePenalSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TranchePenalSFDComponent,
    TranchePenalSFDDetailComponent,
    TranchePenalSFDDialogComponent,
    TranchePenalSFDDeleteDialogComponent,
    TranchePenalSFDPopupComponent,
    TranchePenalSFDDeletePopupComponent
  ],
  entryComponents: [
    TranchePenalSFDComponent,
    TranchePenalSFDDialogComponent,
    TranchePenalSFDPopupComponent,
    TranchePenalSFDDeleteDialogComponent,
    TranchePenalSFDDeletePopupComponent
  ],
  providers: [
    TranchePenalSFDService,
    TranchePenalSFDPopupService,
    TranchePenalSFDResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTranchePenalSFDModule {}
