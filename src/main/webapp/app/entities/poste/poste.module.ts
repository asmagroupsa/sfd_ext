import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared/shared.module';
import {
  PosteService,
  PostePopupService,
  PosteComponent,
  PosteDetailComponent,
  PosteDialogComponent,
  PostePopupComponent,
  PosteDeletePopupComponent,
  PosteDeleteDialogComponent,
  posteRoute,
  postePopupRoute,
  PosteResolvePagingParams
} from '.';

const ENTITY_STATES = [...posteRoute, ...postePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PosteComponent,
    PosteDetailComponent,
    PosteDialogComponent,
    PosteDeleteDialogComponent,
    PostePopupComponent,
    PosteDeletePopupComponent
  ],
  entryComponents: [
    PosteComponent,
    PosteDialogComponent,
    PostePopupComponent,
    PosteDeleteDialogComponent,
    PosteDeletePopupComponent
  ],
  providers: [PosteService, PostePopupService, PosteResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdPosteModule {}
