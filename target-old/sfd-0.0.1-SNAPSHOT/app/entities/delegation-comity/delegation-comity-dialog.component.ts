import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { sendFileToServer, UserData } from '../../shared';
import { Agence } from '../agence';
import { DelegationComityPopupService } from './delegation-comity-popup.service';
import { DelegationComity } from './delegation-comity.model';
import { DelegationComityService } from './delegation-comity.service';

declare const select_init: any;

@Component({
    selector: 'jhi-delegation-comity-dialog',
    templateUrl: './delegation-comity-dialog.component.html',
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
export class DelegationComityDialogComponent implements OnInit, AfterViewInit {
    delegationComity: DelegationComity;
    isSaving: boolean;
    agences: Agence[] = [];
    @ViewChild('file') file: ElementRef;
    label: string = 'Ajoutez un document';
    isSending: boolean = false;
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private delegationComityService: DelegationComityService,
        private eventManager: JhiEventManager
    ) { }

    ngOnInit() {
        this.isSaving = false;
        this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            this.delegationComity.agenceReference = this.agences[0].codeAgence;
        }
    }

    ngAfterViewInit() {
        select_init();
    }
    onChangeFile() {
        if (
            this.file.nativeElement.files &&
            this.file.nativeElement.files.length
        ) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result)
                    this.isSending = true;
                sendFileToServer(this.file.nativeElement.files[0], resp => {
                    this.delegationComity.delegationSignatureFileUrl = resp;
                    this.isSending = false;
                });
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
            this.label = '';
        } else this.label = 'Ajoutez un document';
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.delegationComity.id !== undefined) {
            this.subscribeToSaveResponse(
                this.delegationComityService.update(this.delegationComity)
            );
        } else {
            this.delegationComity.sfdReference =
                UserData.getInstance().sfd ||
                UserData.getInstance().currentSfdReference;
            this.delegationComity.reference = Date.now() + '';
            this.subscribeToSaveResponse(
                this.delegationComityService.create(this.delegationComity)
            );
        }
    }

    private subscribeToSaveResponse(result: Observable<DelegationComity>) {
        result.subscribe(
            (res: DelegationComity) => this.onSaveSuccess(res),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: DelegationComity) {
        this.eventManager.broadcast({
            name: 'delegationComityListModification',
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
    selector: 'jhi-delegation-comity-popup',
    template: ''
})
export class DelegationComityPopupComponent implements OnInit, OnDestroy {
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private delegationComityPopupService: DelegationComityPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.delegationComityPopupService.open(
                    DelegationComityDialogComponent as Component,
                    params['id']
                );
            } else {
                this.delegationComityPopupService.open(
                    DelegationComityDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
