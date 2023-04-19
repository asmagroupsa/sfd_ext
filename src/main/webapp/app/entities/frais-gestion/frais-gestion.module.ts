import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  FraisGestionService,
  FraisGestionPopupService,
  FraisGestionComponent,
  FraisGestionDetailComponent,
  FraisGestionDialogComponent,
  FraisGestionPopupComponent,
  FraisGestionDeletePopupComponent,
  FraisGestionDeleteDialogComponent,
  fraisGestionRoute,
  fraisGestionPopupRoute
} from '.';

const ENTITY_STATES = [...fraisGestionRoute, ...fraisGestionPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FraisGestionComponent,
    FraisGestionDetailComponent,
    FraisGestionDialogComponent,
    FraisGestionDeleteDialogComponent,
    FraisGestionPopupComponent,
    FraisGestionDeletePopupComponent
  ],
  entryComponents: [
    FraisGestionComponent,
    FraisGestionDialogComponent,
    FraisGestionPopupComponent,
    FraisGestionDeleteDialogComponent,
    FraisGestionDeletePopupComponent
  ],
  providers: [FraisGestionService, FraisGestionPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdFraisGestionModule {}
