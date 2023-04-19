import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import {
  ProduitTypeGarantieService,
  ProduitTypeGarantiePopupService,
  ProduitTypeGarantieComponent,
  // TranchePenalDetailComponent,
  ProduitTypeGarantieDialogComponent,
  ProduitTypeGarantiePopupComponent,
  // TranchePenalDeletePopupComponent,
  // TranchePenalDeleteDialogComponent,
  produitTypeGarantieRoute,
  produitTypeGarantiePopupRoute,
  ProduitTypeGarantieResolvePagingParams
} from '.';
import { TypeGarantiePopupService, TypeGarantieService } from '../type-garantie';

const ENTITY_STATES = [...produitTypeGarantieRoute, ...produitTypeGarantiePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProduitTypeGarantieComponent,
    // TranchePenalDetailComponent,
    ProduitTypeGarantieDialogComponent,
    // TranchePenalDeleteDialogComponent,
    ProduitTypeGarantiePopupComponent,
    // TranchePenalDeletePopupComponent
  ],
  entryComponents: [
    ProduitTypeGarantieComponent,
    ProduitTypeGarantieDialogComponent,
    ProduitTypeGarantiePopupComponent,
    // TranchePenalDeleteDialogComponent,
    // TranchePenalDeletePopupComponent
  ],
  providers: [
    ProduitService,
    ProduitTypeGarantieService,
    ProduitTypeGarantieResolvePagingParams,
    ProduitTypeGarantiePopupService,
    ProduitService,
    TypeGarantieService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdProduitTypeGarantieModule {}
