import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import {
  PenalityService,
  PenalityPopupService,
  PenalityComponent,
  TranchePenalDetailComponent,
  PenalityDialogComponent,
  PenalityPopupComponent,
  TranchePenalDeletePopupComponent,
  TranchePenalDeleteDialogComponent,
  tranchePenalRoute,
  tranchePenalPopupRoute,
  TranchePenalResolvePagingParams
} from '.';

const ENTITY_STATES = [...tranchePenalRoute, ...tranchePenalPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PenalityComponent,
    TranchePenalDetailComponent,
    PenalityDialogComponent,
    TranchePenalDeleteDialogComponent,
    PenalityPopupComponent,
    TranchePenalDeletePopupComponent
  ],
  entryComponents: [
    PenalityComponent,
    PenalityDialogComponent,
    PenalityPopupComponent,
    TranchePenalDeleteDialogComponent,
    TranchePenalDeletePopupComponent
  ],
  providers: [
    ProduitService,
    PenalityService,
    PenalityPopupService,
    TranchePenalResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdPenalityModule {}
