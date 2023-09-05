import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  AccountTypeService,
  AccountTypePopupService,
  AccountTypeComponent,
  AccountTypeDetailComponent,
  AccountTypeDialogComponent,
  AccountTypePopupComponent,
  AccountTypeDeletePopupComponent,
  AccountTypeDeleteDialogComponent,
  accountTypeRoute,
  accountTypePopupRoute
} from '.';

const ENTITY_STATES = [...accountTypeRoute, ...accountTypePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AccountTypeComponent,
    AccountTypeDetailComponent,
    AccountTypeDialogComponent,
    AccountTypeDeleteDialogComponent,
    AccountTypePopupComponent,
    AccountTypeDeletePopupComponent
  ],
  entryComponents: [
    AccountTypeComponent,
    AccountTypeDialogComponent,
    AccountTypePopupComponent,
    AccountTypeDeleteDialogComponent,
    AccountTypeDeletePopupComponent
  ],
  providers: [
    AccountTypeService,
    AccountTypePopupService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAccountTypeModule { }
