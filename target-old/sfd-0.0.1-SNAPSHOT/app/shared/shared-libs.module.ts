import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieModule } from 'ngx-cookie';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
    imports: [
        NgbModule.forRoot(),
        NgJhipsterModule.forRoot({
            alertAsToast: false,
            i18nEnabled: false,
            defaultI18nLang: 'fr'
        }),
        DragulaModule,
        InfiniteScrollModule,
        CookieModule.forRoot()
    ],
    exports: [
        FormsModule,
        HttpModule,
        CommonModule,
        DragulaModule,
        NgbModule,
        NgJhipsterModule,
        InfiniteScrollModule
    ]
})
export class SfdSharedLibsModule { }
