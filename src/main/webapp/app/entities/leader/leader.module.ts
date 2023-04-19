import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ClientService } from '../client/client.service';
import {
  LeaderService,
  LeaderPopupService,
  LeaderComponent,
  LeaderDetailComponent,
  LeaderDialogComponent,
  LeaderPopupComponent,
  LeaderDeletePopupComponent,
  LeaderDeleteDialogComponent,
  leaderRoute,
  leaderPopupRoute,
  LeaderResolvePagingParams
} from '.';

const ENTITY_STATES = [...leaderRoute, ...leaderPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LeaderComponent,
    LeaderDetailComponent,
    LeaderDialogComponent,
    LeaderDeleteDialogComponent,
    LeaderPopupComponent,
    LeaderDeletePopupComponent
  ],
  entryComponents: [
    LeaderComponent,
    LeaderDialogComponent,
    LeaderPopupComponent,
    LeaderDeleteDialogComponent,
    LeaderDeletePopupComponent
  ],
  providers: [
    ClientService,
    LeaderService,
    LeaderPopupService,
    LeaderResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdLeaderModule {}
