import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  UnityService,
  UnityPopupService,
  UnityComponent,
  UnityDetailComponent,
  UnityDialogComponent,
  UnityPopupComponent,
  UnityDeletePopupComponent,
  UnityDeleteDialogComponent,
  unityRoute,
  unityPopupRoute
} from '.';

const ENTITY_STATES = [...unityRoute, ...unityPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    UnityComponent,
    UnityDetailComponent,
    UnityDialogComponent,
    UnityDeleteDialogComponent,
    UnityPopupComponent,
    UnityDeletePopupComponent
  ],
  entryComponents: [
    UnityComponent,
    UnityDialogComponent,
    UnityPopupComponent,
    UnityDeleteDialogComponent,
    UnityDeletePopupComponent
  ],
  providers: [UnityService, UnityPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdUnityModule {}
