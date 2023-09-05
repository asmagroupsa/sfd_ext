import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';

import {
  CreditMenuComponent,
  CreditMenuDeleteDialogComponent,
  CreditMenuDeletePopupComponent,
  CreditMenuDetailComponent,
  CreditMenuDialogComponent,
  CreditMenuPopupComponent,
  CreditMenuPopupRoute,
  CreditMenuPopupService,
  CreditMenuRoute,
  CreditMenuService,
} from '.';
import { SfdSharedModule } from '../../shared';
import { ClientService } from '../client';
import { CreditService } from '../credit';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { TypeClientService } from '../type-client';
import { LigneCreditService } from '../ligne-credit';

const ENTITY_STATES = [...CreditMenuRoute, ...CreditMenuPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES), TabsModule],
  declarations: [
    CreditMenuComponent,
    CreditMenuDetailComponent,
    CreditMenuDialogComponent,
    CreditMenuDeleteDialogComponent,
    CreditMenuPopupComponent,
    CreditMenuDeletePopupComponent
  ],
  entryComponents: [
    CreditMenuComponent,
    CreditMenuDialogComponent,
    CreditMenuPopupComponent,
    CreditMenuDeleteDialogComponent,
    CreditMenuDeletePopupComponent
  ],
  providers: [PeriodicityService, DecimalPipe, LigneCreditService,
    CreditMenuService, CreditMenuPopupService, ClientService, TypeClientService, CreditService, CurrencyPipe, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCreditMenuModule { }
