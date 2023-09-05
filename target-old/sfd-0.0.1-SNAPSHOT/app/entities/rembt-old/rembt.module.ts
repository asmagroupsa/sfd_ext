import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { TypeRembtService } from '../type-rembt/type-rembt.service';
import { EcheancesClientService } from '../echeancier-client/echeances-client/echeances-client.service';
import {
  RembtService,
  RembtPopupService,
  RembtComponent,
  RembtDetailComponent,
  RembtDialogComponent,
  RembtPopupComponent,
  RembtDeletePopupComponent,
  RembtDeleteDialogComponent,
  rembtRoute,
  rembtPopupRoute,
  RembtResolvePagingParams
} from '.';

const ENTITY_STATES = [...rembtRoute, ...rembtPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RembtComponent,
    RembtDetailComponent,
    RembtDialogComponent,
    RembtDeleteDialogComponent,
    RembtPopupComponent,
    RembtDeletePopupComponent
  ],
  entryComponents: [
    RembtComponent,
    RembtDialogComponent,
    RembtPopupComponent,
    RembtDeleteDialogComponent,
    RembtDeletePopupComponent
  ],
  providers: [
    EcheancesClientService,
    TypeRembtService,
    RembtService,
    RembtPopupService,
    RembtResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRembtModule {}
