import {Component, OnInit, AfterViewInit} from '@angular/core';
import {UserService} from '../../shared';


declare const select_init: any;

@Component({
    selector: 'jhi-guichetier',
    templateUrl: './guichetier.component.html'
})
export class GuichetierComponent implements OnInit, AfterViewInit {
    guichetiers = [];
    typeGuichetiers = [
        {
            label: 'GUICHETIER FIXE',
            code: 'GUICHETIER_SFD',
        },
        {
            label: 'GUICHETIER AMBULANT',
            code: 'GUICHETIER_SFD_AMBULANT',
        }
    ];
    currentType: any;

    constructor(
        private _userService: UserService
    ) {}

    ngOnInit() {
        this.currentType = this.typeGuichetiers[0];
        this._getGuichetiers();        
    }

    changeType(t) {
        this.currentType = t;
        this._getGuichetiers();
    }

    ngAfterViewInit() {
        select_init();
    }

    private _getGuichetiers() {
        this._userService.listeUtilisateursProfil(this.currentType.code)
        .subscribe(
            (guichetiers) => {
                this.guichetiers = guichetiers;
                select_init();
            }
        );
    }
}
