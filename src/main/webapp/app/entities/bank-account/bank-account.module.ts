import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { BankService } from '../bank';
import {
    BankAccountService,
    BankAccountPopupService,
    BankAccountComponent,
    BankAccountDetailComponent,
    BankAccountDialogComponent,
    BankAccountPopupComponent,
    BankAccountDeletePopupComponent,
    BankAccountDeleteDialogComponent,
    bankAccountRoute,
    bankAccountPopupRoute,
    BankAccountResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...bankAccountRoute,
    ...bankAccountPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        BankAccountComponent,
        BankAccountDetailComponent,
        BankAccountDialogComponent,
        BankAccountDeleteDialogComponent,
        BankAccountPopupComponent,
        BankAccountDeletePopupComponent,
    ],
    entryComponents: [
        BankAccountComponent,
        BankAccountDialogComponent,
        BankAccountPopupComponent,
        BankAccountDeleteDialogComponent,
        BankAccountDeletePopupComponent,
    ],
    providers: [
        BankAccountService,
        BankAccountPopupService,
        BankAccountResolvePagingParams,
        BankService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdBankAccountModule {}
