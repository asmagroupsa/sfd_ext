import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SfdSharedModule } from '../shared';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import {ClientService} from '../entities/client';
import {AgenceService} from '../entities/agence';
import {CreditService} from '../entities/credit';
import {CreditRequestService} from '../entities/credit-request';
import {HomeService} from './home.service';

@NgModule({
  imports: [
    SfdSharedModule,
    RouterModule.forRoot(HOME_ROUTE, { useHash: false }),
    ChartsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [HomeComponent],
  entryComponents: [],
  providers: [CreditService, CreditRequestService, ClientService, AgenceService, HomeService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdHomeModule {}
