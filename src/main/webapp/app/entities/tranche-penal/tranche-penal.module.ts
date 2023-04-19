import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import {
  TranchePenalService,
  TranchePenalPopupService,
  TranchePenalComponent,
  TranchePenalDetailComponent,
  TranchePenalDialogComponent,
  TranchePenalPopupComponent,
  TranchePenalDeletePopupComponent,
  TranchePenalDeleteDialogComponent,
  tranchePenalRoute,
  tranchePenalPopupRoute,
  TranchePenalResolvePagingParams
} from '.';
import { PenalityService } from '../penality';

const ENTITY_STATES = [...tranchePenalRoute, ...tranchePenalPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TranchePenalComponent,
    TranchePenalDetailComponent,
    TranchePenalDialogComponent,
    TranchePenalDeleteDialogComponent,
    TranchePenalPopupComponent,
    TranchePenalDeletePopupComponent
  ],
  entryComponents: [
    TranchePenalComponent,
    TranchePenalDialogComponent,
    TranchePenalPopupComponent,
    TranchePenalDeleteDialogComponent,
    TranchePenalDeletePopupComponent
  ],
  providers: [
    ProduitService,
    PenalityService,
    TranchePenalService,
    TranchePenalPopupService,
    TranchePenalResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTranchePenalModule {}
