import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Principal } from '..';
import { LoginModalService } from '../login/login-modal.service';
import { StateStorageService } from './state-storage.service';
import {enableResourcesControl} from '../model/request-util';

@Injectable()
export class UserRouteAccessService implements CanActivate {
    constructor(
        private router: Router,
        private loginModalService: LoginModalService,
        private principal: Principal,
        private stateStorageService: StateStorageService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Promise<boolean> {

        if (!window.sessionStorage.getItem('jhi-authenticationtoken')){

            this.router.navigate(['/']).then(() => {
            }); 
        }

        if (!enableResourcesControl) {
            return true;
        }

        const authorities = route.data['authorities'];
        if (!authorities || authorities.length === 0) {
            return true;
        }
        const ressources = route.data['ressources'];

        if (ressources && ressources.length) {

         

            let hasRessource: boolean = this.principal.hasAnyRessources(ressources || []);
     
            hasRessource = true;
            if (!hasRessource) {
           
                this.router.navigate(['/']).then(() => {
                 }); 
                return ;
            }
        }
        return this.checkLogin(authorities, state.url);
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(
            principal.identity().then(account => {
                if (account && principal.hasAnyAuthorityDirect(authorities)) {
                    return true;
                }
                this.stateStorageService.storeUrl(url);
                this.router.navigate(['/error', 'accessdenied']).then(() => {
                    // only show the login dialog, if the user hasn't logged in yet
                    if (!account) {
                        this.router.navigate(['/login']);
                    }
                });
                return false;
            })
        );
    }/* 
    checkRessources(url: string): number {
        let liens = UserData.getInstance().liens;

        let index = -1;
        let replaceLink;
        url = url.replace(/\/[0-9]+\//g, '/0/');
        liens.forEach((lien, i) => {
            replaceLink = lien.replace(/\/[0-9]+\//g, '/0/');
            if (replaceLink == url) {
                index = i;
                return;
            }
        });
        return index;
    } */
    /* checkPageAuthority(url: string): boolean {
        let ressources = UserData.getInstance().ressources;
        let index = this.checkRessources(url);
        if (index != -1) {
            let codes = UserData.getInstance().codeRessources;
            let res = codes[index];
            if (ressources.indexOf(res) == -1) {
                return false;
            }
            return true;
        }
        //return false;
        return true;
    } */
}
