import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TypeRembtService,
  TypeRembtPopupService,
  TypeRembtComponent,
  TypeRembtDetailComponent,
  TypeRembtDialogComponent,
  TypeRembtPopupComponent,
  TypeRembtDeletePopupComponent,
  TypeRembtDeleteDialogComponent,
  typeRembtRoute,
  typeRembtPopupRoute,
  TypeRembtResolvePagingParams
} from '.';

const ENTITY_STATES = [...typeRembtRoute, ...typeRembtPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TypeRembtComponent,
    TypeRembtDetailComponent,
    TypeRembtDialogComponent,
    TypeRembtDeleteDialogComponent,
    TypeRembtPopupComponent,
    TypeRembtDeletePopupComponent
  ],
  entryComponents: [
    TypeRembtComponent,
    TypeRembtDialogComponent,
    TypeRembtPopupComponent,
    TypeRembtDeleteDialogComponent,
    TypeRembtDeletePopupComponent
  ],
  providers: [
    TypeRembtService,
    TypeRembtPopupService,
    TypeRembtResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypeRembtModule {}
