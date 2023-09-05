import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  ServiceUserService,
  ServiceUserPopupService,
  ServiceUserComponent,
  ServiceUserDetailComponent,
  ServiceUserDialogComponent,
  ServiceUserPopupComponent,
  ServiceUserDeletePopupComponent,
  ServiceUserDeleteDialogComponent,
  serviceUserRoute,
  serviceUserPopupRoute,
  ServiceUserResolvePagingParams
} from '.';

const ENTITY_STATES = [...serviceUserRoute, ...serviceUserPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ServiceUserComponent,
    ServiceUserDetailComponent,
    ServiceUserDialogComponent,
    ServiceUserDeleteDialogComponent,
    ServiceUserPopupComponent,
    ServiceUserDeletePopupComponent
  ],
  entryComponents: [
    ServiceUserComponent,
    ServiceUserDialogComponent,
    ServiceUserPopupComponent,
    ServiceUserDeleteDialogComponent,
    ServiceUserDeletePopupComponent
  ],
  providers: [
    ServiceUserService,
    ServiceUserPopupService,
    ServiceUserResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdServiceUserModule {}
