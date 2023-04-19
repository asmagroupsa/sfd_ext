import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  ComityMberService,
  ComityMberPopupService,
  ComityMberComponent,
  ComityMberDetailComponent,
  ComityMberDialogComponent,
  ComityMberPopupComponent,
  ComityMberDeletePopupComponent,
  ComityMberDeleteDialogComponent,
  comityMberRoute,
  comityMberPopupRoute,
  ComityMberResolvePagingParams
} from '.';
import { TypeMembreService } from '../type-membre/type-membre.service';
import { ServiceUserService } from '../service-user/service-user.service';
import { AgenceService } from '../agence';

const ENTITY_STATES = [...comityMberRoute, ...comityMberPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ComityMberComponent,
    ComityMberDetailComponent,
    ComityMberDialogComponent,
    ComityMberDeleteDialogComponent,
    ComityMberPopupComponent,
    ComityMberDeletePopupComponent
  ],
  entryComponents: [
    ComityMberComponent,
    ComityMberDialogComponent,
    ComityMberPopupComponent,
    ComityMberDeleteDialogComponent,
    ComityMberDeletePopupComponent
  ],
  providers: [
    ServiceUserService,
    TypeMembreService,
    ComityMberService,
    ComityMberPopupService,
    ComityMberResolvePagingParams,
    AgenceService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdComityMberModule {}
