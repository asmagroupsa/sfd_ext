import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  DepartementService,
  DepartementPopupService,
  DepartementComponent,
  DepartementDetailComponent,
  DepartementDialogComponent,
  DepartementPopupComponent,
  DepartementDeletePopupComponent,
  DepartementDeleteDialogComponent,
  departementRoute,
  departementPopupRoute,
  DepartementResolvePagingParams
} from '.';

const ENTITY_STATES = [...departementRoute, ...departementPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DepartementComponent,
    DepartementDetailComponent,
    DepartementDialogComponent,
    DepartementDeleteDialogComponent,
    DepartementPopupComponent,
    DepartementDeletePopupComponent
  ],
  entryComponents: [
    DepartementComponent,
    DepartementDialogComponent,
    DepartementPopupComponent,
    DepartementDeleteDialogComponent,
    DepartementDeletePopupComponent
  ],
  providers: [
    DepartementService,
    DepartementPopupService,
    DepartementResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDepartementModule {}
