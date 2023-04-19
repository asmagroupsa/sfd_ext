import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../../shared/state/statistiques';
import { Subscription } from 'rxjs';
import { ImageService, UserData, EventBus } from '../../shared'
import { HOST, READFILEURL } from '../../shared/model/request-util';
import { UserService } from '../../shared';

declare const jsPDF: any;

@Component({
    selector: 'jhi-client-membership-form',
    templateUrl: './guichetier-print.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class GuichetierPrintComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _clientId: number;
    private _subscription: Subscription;
    public membershipForm: any[];
    private imageReady: boolean;
    private _guichetierLoadEnd: boolean;
    private _guichetiersLoadEnd = false;
    private increment: number = 0;
    @ViewChild('printZone') printZone: ElementRef;
    private _DePage: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _userService: UserService,
        private _stateService: StateService,
        private _imageService: ImageService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.membershipForm = [];
        this._guichetierLoadEnd = false;
        this._guichetiersLoadEnd = false;
        this.imageReady = false;
    }

    public printAsPdf(printArea): void {
        window.frames["print_frame"].print();
    }

    get endLoad(): boolean {
        let tmp = this._guichetiersLoadEnd && this.imageReady;
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

    private _loadGuichetiers(): void {
        this._userService.guichetierPrint(this._clientId)
            .then((membershipForm: any) => {
                this.membershipForm = membershipForm;
                if (this.membershipForm['picture_url']) {
                    this._imageService.getImageData(this.membershipForm['picture_url'])
                        .then((dataUrl) => {
                            this.membershipForm['picture_url'] = dataUrl;
                            this.imageReady = true;
                        })
                } else {
                    this.membershipForm['picture_url'] = '../../../content/images/avatar.png'
                    this.imageReady = true;
                }
                this._guichetiersLoadEnd = true;
            });
    }


    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
   }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            this._clientId = parseInt(params['id'], 10);
            this._loadGuichetiers();
        });
    }
}

