import {Component, OnInit} from "@angular/core";
import {EtudeService} from "./etude.service";
import {ActivatedRoute} from "@angular/router";
import {HomeService} from "../../shared/mesServices/home-service";
import {CreditRequestService} from "../credit-request";

type P = {
    lat?: number,
    lng?: number,
};

type Dir = {
    origin?: P,
    destination?: P,
};

@Component({
    selector: 'etude-route',
    templateUrl: './route.component.html'
})
export class EtudeRouteComponent implements OnInit {
    etude: any = {};
    clientId: number;
    dir: Dir = {};
    markerOpts: any = {
        origin: {},
        destination: {
            label: 'Client',
        },
    };

    constructor(
        private _etudeService: EtudeService,
        private _activatedRoute: ActivatedRoute,
        private _creditRequestService: CreditRequestService,
        private _homeService: HomeService
    ) {}

    ngOnInit() {
        this._homeService.getLocation()
        .then((c) => {
            const o = {
                lat: c.lat,
                lng: c.lon
            };

            if (!this.dir) {
                this.dir = {};
            }

            this.dir.origin = o;
        })
        .catch(() => {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const o = {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    };
    
                    this.dir.origin = o;
                },
                () => {
                    
                }
            );
        })

        this._etudeService.find(this._activatedRoute.snapshot.params.id).subscribe(
            (etude) => {
                this._creditRequestService.find(etude.creditRequestId).subscribe(
                    (creditRequest: any) => {
                        this.clientId = creditRequest.client.id;
                    },
                    () => {}
                );

                this.etude = etude;
                const d = {
                    lat: etude.geoLat,
                    lng: etude.geoLong
                };

                this.dir.destination = d;
                this.markerOpts.destination.label = etude.client;
            },
            () => {
                
            }
        );
    }
}
