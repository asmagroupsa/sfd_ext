import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ClientService } from '../client/client.service';
import { AccountTypeService } from '../account-type/account-type.service';
import {
  CompteService,
  ComptePopupService,
  CompteComponent,
  CompteDetailComponent,
  CompteDialogComponent,
  ComptePopupComponent,
  CompteDeletePopupComponent,
  CompteDeleteDialogComponent,
  compteRoute,
  comptePopupRoute,
  CompteResolvePagingParams
} from '.';

const ENTITY_STATES = [...compteRoute, ...comptePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CompteComponent,
    CompteDetailComponent,
    CompteDialogComponent,
    CompteDeleteDialogComponent,
    ComptePopupComponent,
    CompteDeletePopupComponent
  ],
  entryComponents: [
    CompteComponent,
    CompteDialogComponent,
    ComptePopupComponent,
    CompteDeleteDialogComponent,
    CompteDeletePopupComponent
  ],
  providers: [
    AccountTypeService,
    ClientService,
    CompteService,
    ComptePopupService,
    CompteResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCompteModule {}
