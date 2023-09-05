import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SfdAppListeRetraitModule} from "./liste-retrait/liste-retrait.module";
import { SfdAppEtatsModule } from "./etats/etats.module";
import { SfdAppCommissionModule } from "./commission/commission.module";

export function listeRetrait() {
    return SfdAppListeRetraitModule;
}

export function etatsSfd() {
    return SfdAppEtatsModule;
}
export function commission() {
    return SfdAppCommissionModule;
}
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'liste-retrait',
                loadChildren: listeRetrait,
            },
            {
                path: 'etats',
                loadChildren: etatsSfd,
            },
            {
                path: 'commission',
                loadChildren: commission,
            },
        ])
    ],
})
export class SfdAppStateModule {}
