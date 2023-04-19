import './vendor.ts';

import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';
import { SfdSharedModule, UserRouteAccessService, ImageService } from './shared';
import { SfdHomeModule } from './home/home.module';
import { SfdAdminModule } from './admin/admin.module';
import { SfdAccountModule } from './account/account.module';
import { SfdEntityModule } from './entities/entity.module';


import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { RouterModule } from '@angular/router';

import { LayoutRoutingModule } from './layouts/layout-routing.module';
import { JhiMainComponent } from './layouts/main/main.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ProfileService } from './layouts/profiles/profile.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { JhiLoginModalComponent } from './shared/login/login.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SfdAuditsModule } from './audits/audits.module';
import { SfdStatsModule } from './audits/stats.module';
import {SfdBilanGlobalModule} from './audits/bilan-global.module';
import { CandidatComponent } from './candidat/candidat.component';
import { CookieModule } from 'ngx-cookie';
import { SFDService } from './entities/s-fd';
import { MainService } from './layouts/main/main.service';
import { FisrtConnectionPopupComponent } from './shared/first-connection/first-connection.component';
//import {AgmCoreModule} from '@agm/core';
import {SfdAppStateModule} from "./state/state.module";
export function audits() {
    return SfdAuditsModule;
}
export function stats() {
    return SfdStatsModule;
}
export function bilanGlobal(){
    return SfdBilanGlobalModule;
}
export function account() {
    return SfdAccountModule;
}
export function layouts() {
    return LayoutRoutingModule;
}
export function admin() {
    return SfdAdminModule;
}
export function entity() {
    return SfdEntityModule;
}
export function state() {
    return SfdAppStateModule;
}

@NgModule({
    imports: [
        BrowserModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        // CurrencyMaskModule,
        RouterModule.forRoot(
            [
                {
                    path: 'candidat',
                    component: CandidatComponent
                },
                {
                    path: 'audits',
                    loadChildren: audits
                },
                {
                    path: 'stats',
                    loadChildren: stats
                },
                {
                    path: 'bilan-global',
                    loadChildren: bilanGlobal
                },
                {
                    path: 'login',
                    component: JhiLoginModalComponent
                }, {
                    path: 'first-connection',
                    component: FisrtConnectionPopupComponent
                },
                {
                    path: 'error',
                    loadChildren: layouts
                },
                {
                    path: 'account',
                    loadChildren: account
                },
                {
                    path: 'admin',
                    canActivate: [UserRouteAccessService],
                    loadChildren: admin
                },
                {
                    path: 'entity',
                    loadChildren: entity
                },
                {
                    path: 'state',
                    loadChildren: state
                },
            ],
            { useHash: true}
        ),
        NgbModule.forRoot(),
        SfdSharedModule.forRoot(),
        SfdHomeModule,
        CookieModule.forRoot(),
      //  AgmCoreModule.forRoot({apiKey: 'AIzaSyA4NQI3QbvIaj6ISapAiC26qR0YYOcKAr8'})
    ],
    declarations: [JhiMainComponent, PageRibbonComponent, CandidatComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        NgbActiveModal,
        UserRouteAccessService,
        SFDService,
        MainService,
        ImageService
    ],
    bootstrap: [JhiMainComponent]
})
export class SfdAppModule { }
