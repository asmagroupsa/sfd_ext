import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CategorieProduitService,
  CategorieProduitPopupService,
  CategorieProduitComponent,
  CategorieProduitDetailComponent,
  CategorieProduitDialogComponent,
  CategorieProduitPopupComponent,
  CategorieProduitDeletePopupComponent,
  CategorieProduitDeleteDialogComponent,
  categorieProduitRoute,
  categorieProduitPopupRoute,
  CategorieProduitResolvePagingParams
} from '.';

const ENTITY_STATES = [...categorieProduitRoute, ...categorieProduitPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategorieProduitComponent,
    CategorieProduitDetailComponent,
    CategorieProduitDialogComponent,
    CategorieProduitDeleteDialogComponent,
    CategorieProduitPopupComponent,
    CategorieProduitDeletePopupComponent
  ],
  entryComponents: [
    CategorieProduitComponent,
    CategorieProduitDialogComponent,
    CategorieProduitPopupComponent,
    CategorieProduitDeleteDialogComponent,
    CategorieProduitDeletePopupComponent
  ],
  providers: [
    CategorieProduitService,
    CategorieProduitPopupService,
    CategorieProduitResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCategorieProduitModule {}
