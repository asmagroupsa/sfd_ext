import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TypeCaisseService,
  TypeCaissePopupService,
  TypeCaisseComponent,
  TypeCaisseDetailComponent,
  TypeCaisseDialogComponent,
  TypeCaissePopupComponent,
  TypeCaisseDeletePopupComponent,
  TypeCaisseDeleteDialogComponent,
  typeCaisseRoute,
  typeCaissePopupRoute,
  TypeCaisseResolvePagingParams
} from '.';

const ENTITY_STATES = [...typeCaisseRoute, ...typeCaissePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TypeCaisseComponent,
    TypeCaisseDetailComponent,
    TypeCaisseDialogComponent,
    TypeCaisseDeleteDialogComponent,
    TypeCaissePopupComponent,
    TypeCaisseDeletePopupComponent
  ],
  entryComponents: [
    TypeCaisseComponent,
    TypeCaisseDialogComponent,
    TypeCaissePopupComponent,
    TypeCaisseDeleteDialogComponent,
    TypeCaisseDeletePopupComponent
  ],
  providers: [
    TypeCaisseService,
    TypeCaissePopupService,
    TypeCaisseResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypeCaisseModule {}
