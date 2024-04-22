import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    ModuleWithProviders
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatNumberByMillerDirective } from './model/format-by-millier';

import {
    SfdSharedLibsModule,
    SfdSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent
} from '.';
import { NAV_DROPDOWN_DIRECTIVES } from './nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './sidebar.directive';
import { AsideToggleDirective } from './aside.directive';
import { RecherchePipe } from './pipes/recherche';
import { AccepterPipe } from './pipes/accepter';
import { SortedPipe, CiblePipe, NonNullablePipe } from './pipes/sorted';
import { LanguesService } from './myTranslation/langues';
import { FnmTranslatePipe } from './myTranslation/fnm-translate.pipe';
import { ThemePalette } from './constants/theme';
import { HomeService } from './mesServices/home-service';
import { NgbdDatepickerI18n } from './myTranslation/date-picker-i18n';
import { EcheancesPipe } from '../entities/echeancier-client/echeances-client/pipe';

import { StateService } from './state/statistiques';
import { CreditComityExpiredPipe } from '../entities/credit-comity/credit-comity-expired.pipe';

import { Parseur } from './model/parseur';
import { SFDService } from '../entities/s-fd/sfd.service';
import { FisrtConnectionComponent, FisrtConnectionPopupComponent } from './first-connection/first-connection.component';
import { FirstConnectionService } from './first-connection/first-connection.service';
import { FirstConnectionModalService } from './first-connection/modal-service';
import { CryptoCookies } from './auth/crypt-cookies.service';
import { SouscriptionGouvernanceUniverselleService } from '../entities/souscription-gouvernance-universelle/souscription-gouvernance-universelle.service';
//import {AgmCoreModule} from '@agm/core';
//import {AgmDirectionModule} from 'agm-direction';

@NgModule({
    imports: [SfdSharedLibsModule, SfdSharedCommonModule, NgbModule],
    declarations: [
        JhiLoginModalComponent,
        FisrtConnectionComponent,
        FisrtConnectionPopupComponent,
        HasAnyAuthorityDirective,
        NAV_DROPDOWN_DIRECTIVES,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        FnmTranslatePipe,
        RecherchePipe,
        SortedPipe,
        NonNullablePipe,
        AccepterPipe,
        CiblePipe,
        EcheancesPipe,
        NgbdDatepickerI18n,
        CreditComityExpiredPipe,
        FormatNumberByMillerDirective
    ],
    entryComponents: [JhiLoginModalComponent, FisrtConnectionComponent, FisrtConnectionPopupComponent],
    exports: [
        SfdSharedCommonModule,
        FisrtConnectionComponent,
        FisrtConnectionPopupComponent,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        NAV_DROPDOWN_DIRECTIVES,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        FnmTranslatePipe,
        RecherchePipe,
        SortedPipe,
        NonNullablePipe,
        AccepterPipe,
        CiblePipe,
        EcheancesPipe,
        NgbdDatepickerI18n,
        CreditComityExpiredPipe,
        FormatNumberByMillerDirective,
        NgbModule,
        //  AgmCoreModule,
        //  AgmDirectionModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SfdSharedModule,
            providers: [
                LoginService,
                FirstConnectionService,
                LoginModalService,
                FirstConnectionModalService,
                AccountService,
                StateStorageService,
                Principal,
                CSRFService,
                AuthServerProvider,
                UserService,
                DatePipe,
                LanguesService,
                HomeService,
                ThemePalette,
                StateService,
                Parseur,
                SFDService,
                CryptoCookies,
                SouscriptionGouvernanceUniverselleService
            ]
        };
    }
}
