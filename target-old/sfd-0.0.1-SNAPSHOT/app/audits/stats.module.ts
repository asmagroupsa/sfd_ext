import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CreditRequestService } from '../entities/credit-request/credit-request.service';
import { LigneCreditService } from '../entities/ligne-credit/ligne-credit.service';
import { PartnerService } from '../entities/partner/partner.service';
import { SfdSharedModule } from '../shared';
import { StatsComponent } from './stats.component';
import { STATS_ROUTE } from './stats.route';
import { StatsService } from './stats.service';
import { SfdRapatriementComponent } from './sfd-rapatriement.component';
import { DatePipe } from '@angular/common';
import { UtilService } from '../shared/util.service';
import { PhaseService } from '../entities/phase/phase.service';
import { SfdEtatsComponent } from './sfd-etats.component';

@NgModule({
  imports: [
    SfdSharedModule,
    RouterModule.forChild(STATS_ROUTE),
    ChartsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [StatsComponent, SfdRapatriementComponent,SfdEtatsComponent],
  entryComponents: [],
  providers: [CreditRequestService, LigneCreditService, PartnerService, StatsService, DatePipe, UtilService, PhaseService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdStatsModule { }