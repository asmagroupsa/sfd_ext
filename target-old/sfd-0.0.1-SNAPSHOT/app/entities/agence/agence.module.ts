import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { SFDService } from '../s-fd/sfd.service';
import { ServiceUserService } from '../service-user/service-user.service';
import {
  AgenceService,
  AgencePopupService,
  AgenceComponent,
  AgenceDetailComponent,
  AgenceDialogComponent,
  AgencePopupComponent,
  AgenceDeletePopupComponent,
  AgenceDeleteDialogComponent,
  agenceRoute,
  agencePopupRoute,
  AgenceResolvePagingParams
} from '.';
import {ZoneAgenceService} from "../zone-agence/zone-agence.service";

const ENTITY_STATES = [...agenceRoute, ...agencePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AgenceComponent,
    AgenceDetailComponent,
    AgenceDialogComponent,
    AgenceDeleteDialogComponent,
    AgencePopupComponent,
    AgenceDeletePopupComponent
  ],
  entryComponents: [
    AgenceComponent,
    AgenceDialogComponent,
    AgencePopupComponent,
    AgenceDeleteDialogComponent,
    AgenceDeletePopupComponent
  ],
  providers: [
    ServiceUserService,
    SFDService,
    AgenceService,
    AgencePopupService,
    AgenceResolvePagingParams,
    ZoneAgenceService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAgenceModule {}
