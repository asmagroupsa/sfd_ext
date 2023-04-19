import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  SFDService,
  SFDPopupService,
  SFDComponent,
  SFDDetailComponent,
  SFDDialogComponent,
  SFDPopupComponent,
  SFDDeletePopupComponent,
  SFDDeleteDialogComponent,
  sFDRoute,
  sFDPopupRoute,
  SFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...sFDRoute, ...sFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SFDComponent,
    SFDDetailComponent,
    SFDDialogComponent,
    SFDDeleteDialogComponent,
    SFDPopupComponent,
    SFDDeletePopupComponent
  ],
  entryComponents: [
    SFDComponent,
    SFDDialogComponent,
    SFDPopupComponent,
    SFDDeleteDialogComponent,
    SFDDeletePopupComponent
  ],
  providers: [SFDService, SFDPopupService, SFDResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSFDModule {}
