import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { GarantieService } from '../garantie/garantie.service';
import { ConditionGarantieService } from '../condition-garantie/condition-garantie.service';
import { ProduitService } from '../produit/produit.service';
import { FiltreConditionsPipe } from './pipe';
import {
  TypeGarantieService,
  TypeGarantiePopupService,
  TypeGarantieComponent,
  TypeGarantieDetailComponent,
  TypeGarantieDialogComponent,
  TypeGarantiePopupComponent,
  TypeGarantieDeletePopupComponent,
  TypeGarantieDeleteDialogComponent,
  typeGarantieRoute,
  typeGarantiePopupRoute
} from '.';

const ENTITY_STATES = [...typeGarantieRoute, ...typeGarantiePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TypeGarantieComponent,
    TypeGarantieDetailComponent,
    TypeGarantieDialogComponent,
    TypeGarantieDeleteDialogComponent,
    TypeGarantiePopupComponent,
    TypeGarantieDeletePopupComponent,
    FiltreConditionsPipe
  ],
  entryComponents: [
    TypeGarantieComponent,
    TypeGarantieDialogComponent,
    TypeGarantiePopupComponent,
    TypeGarantieDeleteDialogComponent,
    TypeGarantieDeletePopupComponent
  ],
  providers: [
    ConditionGarantieService,
    GarantieService,
    ProduitService,
    TypeGarantieService,
    TypeGarantiePopupService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypeGarantieModule {}
