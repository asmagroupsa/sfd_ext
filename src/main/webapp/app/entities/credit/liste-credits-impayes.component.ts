import {Component, ViewChild, ElementRef, AfterViewInit, OnInit} from "@angular/core";
import {SPReportService} from '../../shared/sp-report.service';
import {JhiAlertService} from 'ng-jhipster';
import {getUserRefOrChaineAgence} from '../../shared/model/functions';
import {UserData} from "../../shared/index";
import {ActivatedRoute} from "@angular/router";
import {UtilService} from "../../shared/util.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jhi-liste-credits-impayes',
    templateUrl: './liste-credits-impayes.component.html',
})
export class ListeCreditsImpayesComponent implements AfterViewInit, OnInit {
    @ViewChild('iframe') private _iframe: ElementRef;
    loading = false;
    date;

    constructor(
        private _jhiAlertService: JhiAlertService,
        private _activatedRoute: ActivatedRoute,
        private _utilService: UtilService,
        private _datePipe: DatePipe,
    ) {}

    ngOnInit() {
        const now = new Date();
        this.date = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
    }

    ngAfterViewInit() {
        this.getFile();
    }

    getFile() {
        const ligneCreditId = + this._activatedRoute.snapshot.queryParams.ligneCreditId;
        let url;
        let o;

        if (ligneCreditId) {
            url = 'report/credits-clients-impayes-by-ligne-to-file';
            o = {ligne_credit_id: ligneCreditId};
        } else {
            url = 'report/liste-credit-impayes-to-file';
            const a = getUserRefOrChaineAgence();
            o = a[0] === 'user_reference' ? {user_reference: a[1]} : {chaineAgence: a[1]};
        }

        const date = this._datePipe.transform(
            new Date(`${this.date.year}-${this.date.month}-${this.date.day}`),
            'MM/dd/y'
        );
        o = {
            ...o,
            sfd_name: UserData.getInstance().getSFD().name,
            date: date,
        };
        this.loading = true;

        this._utilService.toFileRequest(url, o, true)
        .then((data) => {
            this.loading = false;
            this._iframe.nativeElement.src = data;
        })
        .catch(() => {
            this.loading = false;
            this._jhiAlertService.error('Erreur');
        });
    }
}
