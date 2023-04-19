import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Credit, CreditService} from '.';
import {AgenceService, Agence} from '../agence';
import {Subscription} from 'rxjs';
import {StateService} from '../../shared/state/statistiques';
import { READFILEURL } from '../../shared/model/request-util';
import { UserData } from '../../shared'


@Component({
    selector: 'jhi-credit-approbation-sheet',
    templateUrl: './credit-approbation-sheet.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class CreditApprobationSheetComponent implements OnInit, OnDestroy {
    private _DePage: any;
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _ficheLoadEnd: boolean;
    private _creditLoadEnd: boolean;
    // private _agenceLoadEnd: boolean;
    public credit: Credit;
    public agence: Agence;
    public fiche: any[];

    constructor(
        private _creditService: CreditService,
        private _activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _agenceService: AgenceService
    ) {

        this.fiche = [];
        this._ficheLoadEnd = false;

    }

    get toDayDate(): Date {
        return new Date;
    }

    get printedBy(): string {
        return 'xxxxxxxxx';
    }

    get hideLoader(): boolean {
        return this._ficheLoadEnd;
    }

    private _getApprobationSheet(creditId: number): void {
        this._creditService.approbationSheet(creditId)
        .subscribe(
            ((fiche: any) => {
                this.fiche = fiche.json[0];
                this._ficheLoadEnd = true;
            })
        );
    }



    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            const creditId: number = parseInt(params['id']);
            this._getApprobationSheet(creditId);
        });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }


    public isSection(id: number): boolean {
        return [1, 13, 20, 29].indexOf(id) > -1;
    }

    public printAsPdf(printArea): void {
        this._stateService.printAsPdf(printArea);
    }
}
