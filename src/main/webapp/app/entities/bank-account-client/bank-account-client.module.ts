import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SfdSharedModule} from '../../shared';
import {bankAccountClientRoute, bankAccountClientPopupRoute, BankAccountClientResolvePagingParams} from './bank-account-client.route';
import {BankAccountClientComponent} from './bank-account-client.component';
import {BankAccountClientDetailComponent} from './bank-account-client-detail.component';
import {BankAccountClientDialogComponent, BankAccountClientPopupComponent} from './bank-account-client-dialog.component';
import {BankAccountClientDeleteDialogComponent, BankAccountClientDeletePopupComponent} from './bank-account-client-delete-dialog.component';
import {BankAccountClientService} from './bank-account-client.service';
import {BankAccountClientPopupService} from './bank-account-client-popup.service';
import {BankService} from '../bank/bank.service';
import {ClientService} from '../client/client.service';

const ENTITY_STATES = [
    ...bankAccountClientRoute,
    ...bankAccountClientPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        BankAccountClientComponent,
        BankAccountClientDetailComponent,
        BankAccountClientDialogComponent,
        BankAccountClientDeleteDialogComponent,
        BankAccountClientPopupComponent,
        BankAccountClientDeletePopupComponent,
    ],
    entryComponents: [
        BankAccountClientComponent,
        BankAccountClientDialogComponent,
        BankAccountClientPopupComponent,
        BankAccountClientDeleteDialogComponent,
        BankAccountClientDeletePopupComponent,
    ],
    providers: [
        BankAccountClientService,
        BankService,
        ClientService,
        BankAccountClientPopupService,
        BankAccountClientResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdBankAccountClientModule {}
