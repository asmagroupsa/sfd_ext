import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {DelegatedMember} from './delegated-member.model';
import {DelegatedMemberPopupService} from './delegated-member-popup.service';
import {DelegatedMemberService} from './delegated-member.service';
import {
    DelegationComity,
    DelegationComityService
} from '../delegation-comity';
import {ComityMber, ComityMberService} from '../comity-mber';
import {ResponseWrapper, UserData} from '../../shared';
import {Agence} from '../agence';
import {RoleDelegatedMember} from '../role-delegated-member/role-delegated-member.model';
import {RoleDelegatedMemberService} from '../role-delegated-member/role-delegated-member.service';
declare let select_init: any;

@Component({
    selector: 'jhi-delegated-member-dialog',
    templateUrl: './delegated-member-dialog.component.html'
})
export class DelegatedMemberDialogComponent implements OnInit {
    agences: Agence[] = [];
    roleDelegatedMembers: RoleDelegatedMember[] = [];
    delegatedMember: DelegatedMember;
    isSaving: boolean;
    delegationcomities: DelegationComity[];
    comitymbers: ComityMber[];
    nominationDateDp: any;
    endNominationDateDp: any;
    delegationComityLibelle: string;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private delegatedMemberService: DelegatedMemberService,
        private delegationComityService: DelegationComityService,
        private comityMberService: ComityMberService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private _roleDelegatedMemberService: RoleDelegatedMemberService,
    ) {}

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            this.delegatedMember.agenceReference = this.agences[0].codeAgence;
        }

        this.isSaving = false;
        /*  this.delegationComityService.query().subscribe(
             (res: ResponseWrapper) => {
                 this.delegationcomities = res.json;
             },
             (res: ResponseWrapper) => this.onError(res.json)
         ); */

        this.delegationComityService
        .find(+this.activatedRoute.snapshot.queryParams['delegation'] || this.delegatedMember.delegationComityId)
        .subscribe(d => {
            this.delegationComityLibelle = d.libelle;
            this.delegatedMember.agenceReference = d.agenceReference;
            this.getComityMembers(d);
        });
        this._getRoleDelegatedMembers();
    }

    getComityMembers(delegation) {
        let comities: string[] = [];
        if (delegation && delegation.delegatedMembers) {
            comities = delegation.delegatedMembers.map((delegated) => {
                return delegated.user;
            });
        }
        this.comityMberService.query({size: 1000, NO_QUERY: true}).subscribe(
            (res: ResponseWrapper) => {
                this.comitymbers = res.json.filter(element => {
                    return comities.indexOf(element.user) == -1;
                });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private _getRoleDelegatedMembers() {
        this._roleDelegatedMemberService.query({
            size: 1000,
            NO_QUERY: true
        })
        .subscribe(
            (r) => {
                this.roleDelegatedMembers = r.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        let delegated = this.comitymbers.find(m => {
            return m.id === this.delegatedMember.comityMberId;
        });
        if (delegated && delegated.user) {
            this.delegatedMember.user = delegated.user;
        }

        if (this.delegatedMember.id !== undefined) {
            this.subscribeToSaveResponse(
                this.delegatedMemberService.update(this.delegatedMember)
            );
        } else {
            this.delegatedMember.sfdReference = UserData.getInstance().currentSfdReference;
            this.subscribeToSaveResponse(
                this.delegatedMemberService.create(this.delegatedMember)
            );
        }
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackDelegationComityById(index: number, item: DelegationComity) {
        return item.id;
    }

    trackComityMberById(index: number, item: ComityMber) {
        return item.id;
    }
    private subscribeToSaveResponse(result: Observable<DelegatedMember>) {
        result.subscribe(
            (res: DelegatedMember) => this.onSaveSuccess(res),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: DelegatedMember) {
        this.eventManager.broadcast({
            name: 'delegatedMemberListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    startDateValidate(): boolean {
        if (this.delegatedMember) {
            let _start = Object.assign({}, this.delegatedMember.nominationDate);
            if (!_start.year || !_start.month || !_start.day) return false;
            _start = new Date(_start.year, _start.month, _start.day);
            if (!_start) return false;
            let today = new Date();
            return _start >= today;
        }
        return false;
    }

    endDateValidate(): boolean {
        if (this.delegatedMember) {
            let _start = Object.assign({}, this.delegatedMember.nominationDate);
            let _end = Object.assign({}, this.delegatedMember.endNominationDate);
            if (!_start.year || !_start.month || !_start.day) return false;
            if (!_end.year || !_end.month || !_end.day) return false;
            _end = new Date(_end.year, _end.month, _end.day);
            _start = new Date(_start.year, _start.month, _start.day);
            if (_start && _end) {
                if (_start > _end) return false;
                else return true;
            }
            return false;
        }
        return false;
    }
}

@Component({
    selector: 'jhi-delegated-member-popup',
    template: ''
})
export class DelegatedMemberPopupComponent implements OnInit, OnDestroy {
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private delegatedMemberPopupService: DelegatedMemberPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.delegatedMemberPopupService.open(
                    DelegatedMemberDialogComponent as Component,
                    params['id']
                );
            } else {
                this.delegatedMemberPopupService.open(
                    DelegatedMemberDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
