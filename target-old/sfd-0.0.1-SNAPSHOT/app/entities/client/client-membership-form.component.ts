import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService, Client } from '.';
import { AgenceService, Agence } from '../agence';
import { StateService } from '../../shared/state/statistiques';
import { Subscription } from 'rxjs';
import {UserData,EventBus} from '../../shared'
import { READFILEURL } from '../../shared/model/request-util';
import { getImgSrc } from '../../shared/model/functions';

declare const jsPDF: any;

@Component({
    selector: 'jhi-client-membership-form',
    templateUrl: './client-membership-form.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class ClientMembershipFormComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _clientId: number;
    private _subscription: Subscription;
    public membershipForm: any[];
    public agence: Agence;
    public client: Client;
  
    private imageReady: boolean;
    private _clientLoadEnd: boolean;
    private _agenceLoadEnd = false;
    private _membershipFormLoadEnd = false;
    private increment: number = 0;
    @ViewChild('printZone') printZone: ElementRef;
    private _DePage: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _clientService: ClientService,
        private _agenceService: AgenceService,
        private _stateService: StateService,
       
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        this.membershipForm = [];
        this.agence = null;
        // this.client = null;
        this._clientLoadEnd = false;
        this._agenceLoadEnd = false;
        this._membershipFormLoadEnd = false;
        this.imageReady = false;
    }

    public printAsPdf(printArea): void {
        window.frames["print_frame"].print();
    }


    get endLoad(): boolean {
        let tmp = this._membershipFormLoadEnd && this._clientLoadEnd && this._agenceLoadEnd && this.imageReady;

        if (tmp) {
            if (this.increment === 0) {
                this.increment = this.increment + 1
                this._changeDetectorRef.detectChanges()
                let printArea = this.printZone.nativeElement.innerHTML;
                let printCanvas = this.printZone.nativeElement.querySelectorAll('canvas');
                if (printCanvas) {
                    this._stateService.printAsPdf2(printArea, printCanvas);
                } else {
                    this._stateService.printAsPdf2(printArea);
                }
            }
        }
        return tmp;
    }

    public getImg(img) {
        return getImgSrc(img)
    }

    private _loadMembershipForm(): void {
        this._clientService.membershipForm(this._clientId)
        .then((membershipForm: any) => {
            this.membershipForm = membershipForm;
            if (this.membershipForm['picture_url']){
                this.membershipForm['picture_url'] = this.getImg(this.membershipForm['picture_url']);
                this.imageReady = true;
             /*  this._imageService.getImageData(this.membershipForm['picture_url'])
              .then((dataUrl) => {
                  this.membershipForm['picture_url'] = dataUrl;
                  this.imageReady=true;
              })
                .catch((err) => {
                    this.membershipForm['picture_url']  = '../../../content/images/avatar.png'
                     this.imageReady = true;
                  }) */
            }else {
                this.membershipForm['picture_url'] = '../../../content/images/avatar.png'
                this.imageReady=true;
            }
            this._membershipFormLoadEnd = true;
        });
    }

    private _loadClientAgence(): void {
        this._agenceService.find(this.client.agenceId).toPromise()
            .then((agence: Agence) => {
                this.agence = agence;
                this._agenceLoadEnd = true;
            });
    }

    private _loadClient(): void {
        this._clientService.find(this._clientId).toPromise()
            .then((client: Client) => {
                this.client = client;
                this._loadClientAgence();
                this._clientLoadEnd = true;
            });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
        this._subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            this._clientId = parseInt(params['id'], 10);
            this._loadClient();
            this._loadMembershipForm();
        });
    }

    public print(): void {
        const pdf: any = new jsPDF();

        imageToDataURL('http://localhost:9000/content/image.jpg', 'image/jpeg')
            .then((image: any) => {
                const width = 190;
                const height: number = (image.height * width) / image.width;

                pdf.addImage('http://localhost:9000/content/header.png', 'JPEG', 10, 0, width, height);
                pdf.addImage(image.dataURL, 'JPEG', 10, (297 - height), width, height);

                window.open(pdf.output('dataurlnewwindow'));
            });

        // this._stateService.save('#membership-form', `client_${this._clientId}_membership_form`);
        // this._stateService.htmlToPdf('#membership-form', `client_${this._clientId}_membership_form`);
    }
}

function imageToDataURL(url: string, format: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        image.src = url;

        image.addEventListener('load', () => {
            const imageHeight: number = image.height;
            const imageWidth: number = image.width;

            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.height = imageHeight;
            canvas.width = imageWidth;

            const contex: CanvasRenderingContext2D = canvas.getContext('2d');
            contex.drawImage(image, 0, 0);

            resolve({
                dataURL: canvas.toDataURL(format),
                height: imageHeight,
                width: imageWidth
            });
        });
    });
}
