import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProduitService} from '../produit/produit.service';
import { SfdSharedModule } from '../../shared';
import {
  FraisService,
  FraisPopupService,
  FraisComponent,
  FraisDetailComponent,
  FraisDialogComponent,
  FraisPopupComponent,
  FraisDeletePopupComponent,
  FraisDeleteDialogComponent,
  fraisRoute,
  fraisPopupRoute,
  FraisResolvePagingParams
} from '.';

const ENTITY_STATES = [...fraisRoute, ...fraisPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FraisComponent,
    FraisDetailComponent,
    FraisDialogComponent,
    FraisDeleteDialogComponent,
    FraisPopupComponent,
    FraisDeletePopupComponent
  ],
  entryComponents: [
    FraisComponent,
    FraisDialogComponent,
    FraisPopupComponent,
    FraisDeleteDialogComponent,
    FraisDeletePopupComponent
  ],
  providers: [ProduitService,FraisService, FraisPopupService, FraisResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdFraisModule {}
