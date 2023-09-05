import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CreditRequestService } from '../entities/credit-request/credit-request.service';
import { LigneCreditService } from '../entities/ligne-credit/ligne-credit.service';
import { PartnerService } from '../entities/partner/partner.service';
import { ProduitService } from '../entities/produit/produit.service';
import { SfdSharedModule } from '../shared';
import { BILAN_GLOBAL_ROUTE } from './bilan-global.route';
import { StatsService } from './stats.service';
import {BilanGlobalSheetComponent} from './bilan-global';
import { DatePipe,CurrencyPipe,DecimalPipe } from '@angular/common';
@NgModule({
  imports: [
    SfdSharedModule,
    RouterModule.forChild(BILAN_GLOBAL_ROUTE),
    ChartsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [BilanGlobalSheetComponent],
  entryComponents: [],
  providers: [CreditRequestService, LigneCreditService, PartnerService,ProduitService, StatsService,CurrencyPipe,DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdBilanGlobalModule { }