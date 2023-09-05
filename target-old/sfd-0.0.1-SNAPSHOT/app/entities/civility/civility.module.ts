import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CivilityService,
  CivilityPopupService,
  CivilityComponent,
  CivilityDetailComponent,
  CivilityDialogComponent,
  CivilityPopupComponent,
  CivilityDeletePopupComponent,
  CivilityDeleteDialogComponent,
  civilityRoute,
  civilityPopupRoute
} from '.';

const ENTITY_STATES = [...civilityRoute, ...civilityPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CivilityComponent,
    CivilityDetailComponent,
    CivilityDialogComponent,
    CivilityDeleteDialogComponent,
    CivilityPopupComponent,
    CivilityDeletePopupComponent
  ],
  entryComponents: [
    CivilityComponent,
    CivilityDialogComponent,
    CivilityPopupComponent,
    CivilityDeleteDialogComponent,
    CivilityDeletePopupComponent
  ],
  providers: [CivilityService, CivilityPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCivilityModule {}
