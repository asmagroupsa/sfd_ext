import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response, Http } from '@angular/http';
import { setCreateBy, setLastModifyBy, EventBus } from '../../shared/model/functions';
import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Partner } from './partner.model';
import { PartnerPopupService } from './partner-popup.service';
import { PartnerService } from './partner.service';
import { ResponseWrapper, LOCAL_FLAG } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { LanguesService } from '../../shared/myTranslation/langues';
import { sendFileToServer, createRequestOption, READFILEURL, READBITFILEURL } from '../../shared/model/request-util';
import { DomSanitizer } from '@angular/platform-browser';
declare let select_init: any;
@Component({
    selector: 'jhi-partner-dialog',
    templateUrl: './partner-dialog.component.html',
    styles: [
        `
   .label,
.camera {
  display: block;
  border: 1px solid lightblue;
  height: 150px;
  text-align: center;
  padding-top: 50px;
  cursor: pointer;
  position: relative;
}

.label {
  background: lightseagreen;
      background-size: cover;
  background: lightseagreen;
}

.camera {
  background: darkcyan;
}

.close:not(.modal-header.close)  {
  position: absolute;
  top: 0;
  right: 15px;
  z-index: 1000;
}

.camera video,
.camera canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.or {
  height: 150px;
  font-style: italic;
  text-align: center;
  padding-top: 50px;
}
  `
    ]
})
export class PartnerDialogComponent implements OnInit {
    partner: Partner;
    @ViewChild('file') file: ElementRef;
    label: string = 'Selectionnez la photo du bailleur';
    authorities: any[];
    isSaving: boolean;

    createdDateDp: any;
    lastModifiedDateDp: any;
    @ViewChild('labelPhoto') labelPhoto: any;
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private partnerService: PartnerService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private http: Http,
        private domSanitizer: DomSanitizer,
        public langue: LanguesService
    ) { }

    ngAfterViewInit() {
        select_init();
        this.onLoaded();
    }
    onLoaded() {
        if (!this.partner.logo) return;
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
            .get(`${READBITFILEURL}${this.partner.logo}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            })
            .subscribe(url => {
                /* user.picture = this.domSanitizer.bypassSecurityTrustUrl(
                    url
                ); */
                if (this.labelPhoto.nativeElement) {
                    this.labelPhoto.nativeElement.style.backgroundImage =
                        'url(' + url + ')';
                    this.labelPhoto.nativeElement.style.backgroundSize = 'cover';
                }
            }
            );
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }
    onChangeFile(labelPhoto) {
        if (
            this.file.nativeElement.files &&
            this.file.nativeElement.files.length
        ) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result)
                    labelPhoto.style.backgroundImage =
                        'url(' + e.target.result + ')';
                sendFileToServer(this.file.nativeElement.files[0], resp => {
                    this.partner.logo = resp;
                });
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
            this.label = '';
        } else this.label = 'Selectionnez une photo';
    }
    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.partner.id !== undefined) {
                    setLastModifyBy(this.partner, identity);
                    //this.partner.lastModifiedBy = identity.firstName || '';
                    //this.partner.lastModifiedBy += //' ' + identity.lastName || '';
                    this.subscribeToSaveResponse(
                        this.partnerService.update(this.partner),
                        false
                    );
                } else {
                    setCreateBy(this.partner, identity);
                    //this.partner.createdBy = identity.firstName || '';
                    //this.partner.createdBy += //' ' + identity.lastName || '';
                    this.subscribeToSaveResponse(
                        this.partnerService.create(this.partner),
                        true
                    );
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Partner>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Partner) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Partner, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.partner.created'
                : 'carmesfnmserviceApp.partner.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'partnerListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
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
}

@Component({
    selector: 'jhi-partner-popup',
    template: ''
})
export class PartnerPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private partnerPopupService: PartnerPopupService
    ) { }

    ngOnInit() {
        if (LOCAL_FLAG) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.partnerPopupService.open(
                        PartnerDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.partnerPopupService.open(
                        PartnerDialogComponent as Component
                    );
                }
            });
        } else {
            window.history.back();
        }
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
