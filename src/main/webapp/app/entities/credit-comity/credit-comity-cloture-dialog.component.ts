import { Component, OnInit, OnDestroy,ViewChild,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http,Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LanguesService } from '../../shared/myTranslation/langues';
import { sendFileToServer, createRequestOption, READFILEURL, READBITFILEURL } from '../../shared/model/request-util';
import { CreditComity } from './credit-comity.model';
import { CreditComityPopupService } from './credit-comity-popup.service';
import { CreditComityService } from './credit-comity.service';

@Component({
  selector: 'jhi-credit-comity-cloture-dialog',
  templateUrl: './credit-comity-cloture-dialog.component.html',
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
export class CreditComityClotureDialogComponent {
  creditComity: CreditComity;
  documentExist:boolean = false;
  isSendingFile:boolean = false;
   @ViewChild('file') file: ElementRef;
    label: string = 'Réferencer un document pour ce comité';
 @ViewChild('labelPhoto') labelPhoto: any;
  constructor(
    private creditComityService: CreditComityService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    public langue: LanguesService,
    private http:Http
  ) {
    
  }
  ngAfterViewInit(){
    if(this.creditComity)
    this.documentExist = !!this.creditComity.documentUrl;
  }
onLoaded() {
        if (!this.creditComity.documentUrl) return;
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
            .get(`${READBITFILEURL}${this.creditComity.documentUrl}`, options)
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            })
            .subscribe(url => {
                /* user.picture = this.domSanitizer.bypassSecurityTrustUrl(
                    url
                ); */
                // if (this.labelPhoto.nativeElement) {
                //     this.labelPhoto.nativeElement.style.backgroundImage =
                //         'url(' + url + ')';
                //     this.labelPhoto.nativeElement.style.backgroundSize = 'cover';
                // }
            }
            );
    }
    onChangeFile(labelPhoto) {
        if (
            this.file.nativeElement.files &&
            this.file.nativeElement.files.length
        ) {
          this.isSendingFile = true; 
            let reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result)
                    labelPhoto.style.backgroundImage =
                        'url(' + e.target.result + ')';
                sendFileToServer(this.file.nativeElement.files[0], resp => {
                    this.creditComity.documentUrl = resp;
                    this.isSendingFile = false; 
                });
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
            this.label = '';
        } else this.label = 'Réferencer un document pour ce comité';
    }
  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.creditComity.dossierComplets = true;
    this.creditComityService.update(this.creditComity).subscribe(response => {
      this.eventManager.broadcast({
        name: 'creditComityListModification',
        content: 'Deleted an creditComity'
      });
      this.activeModal.dismiss(true);
      this.alertService.success(`Les dossiers pour le comité ${this.creditComity.libelle} sont cloturés`, null, null);
    }, (e) => {
      this.alertService.error("Une erreur s'est produite lors de la modification", null, null);
    });
  }
}

@Component({
  selector: 'jhi-credit-comity-cloture-popup',
  template: ''
})
export class CreditComityCloturePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private creditComityPopupService: CreditComityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.creditComityPopupService.open(
        CreditComityClotureDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
