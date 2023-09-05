import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import {
  ConditionsService,
  ConditionsPopupService,
  ConditionsComponent,
  ConditionsDetailComponent,
  ConditionsDialogComponent,
  ConditionsPopupComponent,
  ConditionsDeletePopupComponent,
  ConditionsDeleteDialogComponent,
  conditionsRoute,
  conditionsPopupRoute,
  ConditionsResolvePagingParams
} from '.';

const ENTITY_STATES = [...conditionsRoute, ...conditionsPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ConditionsComponent,
    ConditionsDetailComponent,
    ConditionsDialogComponent,
    ConditionsDeleteDialogComponent,
    ConditionsPopupComponent,
    ConditionsDeletePopupComponent
  ],
  entryComponents: [
    ConditionsComponent,
    ConditionsDialogComponent,
    ConditionsPopupComponent,
    ConditionsDeleteDialogComponent,
    ConditionsDeletePopupComponent
  ],
  providers: [
    ProduitService,
    ConditionsService,
    ConditionsPopupService,
    ConditionsResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdConditionsModule {}
