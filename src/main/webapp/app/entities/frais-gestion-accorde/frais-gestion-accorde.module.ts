import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  FraisGestionAccordeService,
  FraisGestionAccordePopupService,
  FraisGestionAccordeComponent,
  FraisGestionAccordeDetailComponent,
  FraisGestionAccordeDialogComponent,
  FraisGestionAccordePopupComponent,
  FraisGestionAccordeDeletePopupComponent,
  FraisGestionAccordeDeleteDialogComponent,
  fraisGestionAccordeRoute,
  fraisGestionAccordePopupRoute,
  FraisGestionAccordeResolvePagingParams
} from '.';

const ENTITY_STATES = [
  ...fraisGestionAccordeRoute,
  ...fraisGestionAccordePopupRoute
];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FraisGestionAccordeComponent,
    FraisGestionAccordeDetailComponent,
    FraisGestionAccordeDialogComponent,
    FraisGestionAccordeDeleteDialogComponent,
    FraisGestionAccordePopupComponent,
    FraisGestionAccordeDeletePopupComponent
  ],
  entryComponents: [
    FraisGestionAccordeComponent,
    FraisGestionAccordeDialogComponent,
    FraisGestionAccordePopupComponent,
    FraisGestionAccordeDeleteDialogComponent,
    FraisGestionAccordeDeletePopupComponent
  ],
  providers: [
    FraisGestionAccordeService,
    FraisGestionAccordePopupService,
    FraisGestionAccordeResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdFraisGestionAccordeModule {}
