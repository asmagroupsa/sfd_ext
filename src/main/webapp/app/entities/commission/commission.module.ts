import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ClientService } from '../client/client.service';
import {
  CommissionService,
  CommissionPopupService,
  CommissionComponent,
  CommissionDetailComponent,
  CommissionDialogComponent,
  CommissionPopupComponent,
  CommissionDeletePopupComponent,
  CommissionDeleteDialogComponent,
  commissionRoute,
  commissionPopupRoute,
  CommissionResolvePagingParams
} from '.';

const ENTITY_STATES = [...commissionRoute, ...commissionPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CommissionComponent,
    CommissionDetailComponent,
    CommissionDialogComponent,
    CommissionDeleteDialogComponent,
    CommissionPopupComponent,
    CommissionDeletePopupComponent
  ],
  entryComponents: [
    CommissionComponent,
    CommissionDialogComponent,
    CommissionPopupComponent,
    CommissionDeleteDialogComponent,
    CommissionDeletePopupComponent
  ],
  providers: [
    CommissionService,
    CommissionPopupService,
    CommissionResolvePagingParams,
    ClientService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCommissionModule {}
