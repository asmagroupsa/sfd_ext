import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../../shared/state/statistiques';
import { NotificationClientService } from './notification-client.service';
import { DossierService, Dossier } from '../dossier';
import { Subscription } from 'rxjs';
import { UserData } from '../../shared'
import { HOST,  READFILEURL } from '../../shared/model/request-util';

@Component({
    selector: 'jhi-dossier-commity-membre-print.component',
    templateUrl: './dossier-commity-membre-print.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class DossierCommityMembrePrintComponent implements OnInit, OnDestroy {
    private _subscription: Subscription;
    private _noificationId: number;
    public fiche: any;
    private _DePage: any;
    private imageUrl = READFILEURL;

    // public _dossier=Dossier;

    constructor(
        private _stateService: StateService,
        private _notificationClientService: NotificationClientService,
        private _route: ActivatedRoute,
        // private dossierservice=DossierService
    ) {
        this.fiche = null;
    }

    get todayDate(): Date {
        return new Date;
    }

    get hole(): string {
        return '___VARIABLE___';
    }

    get ficheIsLoad(): boolean {
        return this.fiche != null;
    }

    private _loadFiche(): void {
        this._subscription = this._notificationClientService.ficheNotificationCredit(this._noificationId).subscribe(
            ((fiche: any) => {
                this.fiche = fiche;
            })
        );
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._route.params.subscribe((params: any[]) => {
            this._noificationId = parseInt(params['id']);
            this._loadFiche();
        });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public printAsPdf(print): void {
        this._stateService.printAsPdf(print);
    }
}
