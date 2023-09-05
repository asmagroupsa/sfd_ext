import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SfdSharedModule } from '../shared';
import { AUDITS_ROUTE } from './audits.route';
import { AuditsComponent } from './audits.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CreditRequestService } from '../entities/credit-request/credit-request.service';
import { LigneCreditService } from '../entities/ligne-credit/ligne-credit.service';
import { PartnerService } from '../entities/partner/partner.service';
import { AgencesStatistiquesComponent } from './agences-statistiques.component'
import { AuditsService } from './audits.service'
import { DashboardComponent } from './dasboard.component';

@NgModule({
  imports: [
    SfdSharedModule,
    RouterModule.forChild(AUDITS_ROUTE),
    ChartsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [AuditsComponent, DashboardComponent, AgencesStatistiquesComponent],
  entryComponents: [],
  providers: [CreditRequestService, LigneCreditService, PartnerService, AuditsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAuditsModule { }