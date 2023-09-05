import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TownShipService,
  TownShipPopupService,
  TownShipComponent,
  TownShipDetailComponent,
  TownShipDialogComponent,
  TownShipPopupComponent,
  TownShipDeletePopupComponent,
  TownShipDeleteDialogComponent,
  townShipRoute,
  townShipPopupRoute,
  TownShipResolvePagingParams
} from '.';

const ENTITY_STATES = [...townShipRoute, ...townShipPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TownShipComponent,
    TownShipDetailComponent,
    TownShipDialogComponent,
    TownShipDeleteDialogComponent,
    TownShipPopupComponent,
    TownShipDeletePopupComponent
  ],
  entryComponents: [
    TownShipComponent,
    TownShipDialogComponent,
    TownShipPopupComponent,
    TownShipDeleteDialogComponent,
    TownShipDeletePopupComponent
  ],
  providers: [
    TownShipService,
    TownShipPopupService,
    TownShipResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTownShipModule {}
