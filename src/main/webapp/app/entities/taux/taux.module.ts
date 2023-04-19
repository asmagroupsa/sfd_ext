import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import {
  TauxService,
  TauxPopupService,
  TauxComponent,
  TauxDetailComponent,
  TauxDialogComponent,
  TauxPopupComponent,
  TauxDeletePopupComponent,
  TauxDeleteDialogComponent,
  tauxRoute,
  tauxPopupRoute,
  TauxResolvePagingParams
} from '.';

const ENTITY_STATES = [...tauxRoute, ...tauxPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TauxComponent,
    TauxDetailComponent,
    TauxDialogComponent,
    TauxDeleteDialogComponent,
    TauxPopupComponent,
    TauxDeletePopupComponent
  ],
  entryComponents: [
    TauxComponent,
    TauxDialogComponent,
    TauxPopupComponent,
    TauxDeleteDialogComponent,
    TauxDeletePopupComponent
  ],
  providers: [
    ProduitService,
    TauxService,
    TauxPopupService,
    TauxResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTauxModule {}
