import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TauxSFDService,
  TauxSFDPopupService,
  TauxSFDComponent,
  TauxSFDDetailComponent,
  TauxSFDDialogComponent,
  TauxSFDPopupComponent,
  TauxSFDDeletePopupComponent,
  TauxSFDDeleteDialogComponent,
  tauxSFDRoute,
  tauxSFDPopupRoute,
  TauxSFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...tauxSFDRoute, ...tauxSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TauxSFDComponent,
    TauxSFDDetailComponent,
    TauxSFDDialogComponent,
    TauxSFDDeleteDialogComponent,
    TauxSFDPopupComponent,
    TauxSFDDeletePopupComponent
  ],
  entryComponents: [
    TauxSFDComponent,
    TauxSFDDialogComponent,
    TauxSFDPopupComponent,
    TauxSFDDeleteDialogComponent,
    TauxSFDDeletePopupComponent
  ],
  providers: [TauxSFDService, TauxSFDPopupService, TauxSFDResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTauxSFDModule {}
