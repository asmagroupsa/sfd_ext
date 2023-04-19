import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import {
  TauxEpargneService,
  TauxEpargnePopupService,
  TauxEpargneComponent,
  TauxEpargneDetailComponent,
  TauxEpargneDialogComponent,
  TauxEpargnePopupComponent,
  TauxEpargneDeletePopupComponent,
  TauxEpargneDeleteDialogComponent,
  tauxEpargneRoute,
  tauxEpargnePopupRoute,
  TauxEpargneResolvePagingParams
} from '.';

const ENTITY_STATES = [...tauxEpargneRoute, ...tauxEpargnePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TauxEpargneComponent,
    TauxEpargneDetailComponent,
    TauxEpargneDialogComponent,
    TauxEpargneDeleteDialogComponent,
    TauxEpargnePopupComponent,
    TauxEpargneDeletePopupComponent
  ],
  entryComponents: [
    TauxEpargneComponent,
    TauxEpargneDialogComponent,
    TauxEpargnePopupComponent,
    TauxEpargneDeleteDialogComponent,
    TauxEpargneDeletePopupComponent
  ],
  providers: [
    ProduitService,
    TauxEpargneService,
    TauxEpargnePopupService,
    TauxEpargneResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTauxEpargneModule {}
