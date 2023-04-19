import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../../shared/state/statistiques';
import { NotificationClientService } from './notification-client.service';
import { Subscription } from 'rxjs';
import { ImageService, UserData, EventBus } from '../../shared'
declare let qrGenerator: any;

@Component({
    selector: 'jhi-notification-client-print.component',
    templateUrl: './notification-client-print.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class NotificationClientPrintComponent implements OnInit, OnDestroy {
    private _subscription: Subscription;
    private _noificationId: number;
    public data: any;
    @ViewChild('printZone') printZone: ElementRef;
    private imageReady: boolean;
    private increment: number = 0;
    private _dataLoadEnd: boolean;
    private _DePage: any;
    @ViewChild('qrimage') qrimage: ElementRef;
    private qrObj: any = { type: 'SFD', reference: '' };

    constructor(
        private _stateService: StateService,
        private _notificationClientService: NotificationClientService,
        private _route: ActivatedRoute,
        // private _imageService: ImageService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.data = [];
        this._dataLoadEnd = false
    }

    

    get ficheIsLoad(): boolean {
        let tmp = this._dataLoadEnd;

        if (tmp) {

            if (this.increment === 0) {
                this.increment = this.increment + 1
                this._changeDetectorRef.detectChanges()
                let opts = {
                    errorCorrectionLevel: 'H',
                    type: 'image/webp',
                    rendererOpts: {
                        quality: 0.3
                    }
                }

                qrGenerator().toDataURL(JSON.stringify(this.qrObj), opts, (err, url) => {
                    if (err) throw err
                    this.qrimage.nativeElement.src = url;
                    /* img.src = url */
                })
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

    get todayDate(): Date {
        return new Date;
    }
    private _loadFiche(): void {
        this._subscription = this._notificationClientService.ficheNotificationCredit(this._noificationId)
            .subscribe(((fiche: any) => {
                this.data = fiche;
                this.qrObj.reference = this.data.reference;
                this._dataLoadEnd = true;
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
        window.frames["print_frame"].print();
    }
}
