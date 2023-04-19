import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  IdCardTypeService,
  IdCardTypePopupService,
  IdCardTypeComponent,
  IdCardTypeDetailComponent,
  IdCardTypeDialogComponent,
  IdCardTypePopupComponent,
  IdCardTypeDeletePopupComponent,
  IdCardTypeDeleteDialogComponent,
  idCardTypeRoute,
  idCardTypePopupRoute
} from '.';

const ENTITY_STATES = [...idCardTypeRoute, ...idCardTypePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    IdCardTypeComponent,
    IdCardTypeDetailComponent,
    IdCardTypeDialogComponent,
    IdCardTypeDeleteDialogComponent,
    IdCardTypePopupComponent,
    IdCardTypeDeletePopupComponent
  ],
  entryComponents: [
    IdCardTypeComponent,
    IdCardTypeDialogComponent,
    IdCardTypePopupComponent,
    IdCardTypeDeleteDialogComponent,
    IdCardTypeDeletePopupComponent
  ],
  providers: [IdCardTypeService, IdCardTypePopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdIdCardTypeModule {}
