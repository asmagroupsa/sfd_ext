import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  SettingSFDService,
  SettingSFDPopupService,
  SettingSFDComponent,
  SettingSFDDetailComponent,
  SettingSFDDialogComponent,
  SettingSFDPopupComponent,
  SettingSFDDeletePopupComponent,
  SettingSFDDeleteDialogComponent,
  settingSFDRoute,
  settingSFDPopupRoute,
  SettingSFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...settingSFDRoute, ...settingSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SettingSFDComponent,
    SettingSFDDetailComponent,
    SettingSFDDialogComponent,
    SettingSFDDeleteDialogComponent,
    SettingSFDPopupComponent,
    SettingSFDDeletePopupComponent
  ],
  entryComponents: [
    SettingSFDComponent,
    SettingSFDDialogComponent,
    SettingSFDPopupComponent,
    SettingSFDDeleteDialogComponent,
    SettingSFDDeletePopupComponent
  ],
  providers: [
    SettingSFDService,
    SettingSFDPopupService,
    SettingSFDResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSettingSFDModule {}
