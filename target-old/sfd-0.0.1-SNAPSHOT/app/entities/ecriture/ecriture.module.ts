import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  EcritureService,
  EcriturePopupService,
  EcritureComponent,
  EcritureDetailComponent,
  EcritureDialogComponent,
  EcriturePopupComponent,
  EcritureDeletePopupComponent,
  EcritureDeleteDialogComponent,
  ecritureRoute,
  ecriturePopupRoute,
  EcritureResolvePagingParams
} from '.';

const ENTITY_STATES = [...ecritureRoute, ...ecriturePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EcritureComponent,
    EcritureDetailComponent,
    EcritureDialogComponent,
    EcritureDeleteDialogComponent,
    EcriturePopupComponent,
    EcritureDeletePopupComponent
  ],
  entryComponents: [
    EcritureComponent,
    EcritureDialogComponent,
    EcriturePopupComponent,
    EcritureDeleteDialogComponent,
    EcritureDeletePopupComponent
  ],
  providers: [
    EcritureService,
    EcriturePopupService,
    EcritureResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdEcritureModule {}
