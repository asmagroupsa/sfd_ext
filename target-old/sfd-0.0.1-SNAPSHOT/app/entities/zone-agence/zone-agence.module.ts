import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { SFDService } from '../s-fd/sfd.service';
import { AgenceService } from '../agence/agence.service';
import {
  ZoneAgenceService,
  ZoneAgencePopupService,
  ZoneAgenceComponent,
  ZoneAgenceDetailComponent,
  ZoneAgenceDialogComponent,
  ZoneAgencePopupComponent,
  ZoneAgenceDeletePopupComponent,
  ZoneAgenceDeleteDialogComponent,
  zoneAgenceRoute,
  zoneAgencePopupRoute,
  ZoneAgenceResolvePagingParams
} from '.';

const ENTITY_STATES = [...zoneAgenceRoute, ...zoneAgencePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ZoneAgenceComponent,
    ZoneAgenceDetailComponent,
    ZoneAgenceDialogComponent,
    ZoneAgenceDeleteDialogComponent,
    ZoneAgencePopupComponent,
    ZoneAgenceDeletePopupComponent
  ],
  entryComponents: [
    ZoneAgenceComponent,
    ZoneAgenceDialogComponent,
    ZoneAgencePopupComponent,
    ZoneAgenceDeleteDialogComponent,
    ZoneAgenceDeletePopupComponent
  ],
  providers: [
    ZoneAgenceService,
    AgenceService,
    SFDService,
    ZoneAgencePopupService,
    ZoneAgenceResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdZoneAgenceModule {}
