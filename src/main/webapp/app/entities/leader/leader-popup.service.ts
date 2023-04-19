import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Leader } from './leader.model';
import { LeaderService } from './leader.service';

@Injectable()
export class LeaderPopupService {
  private isOpen = false;
  entId: any;
  links: string[] = [];
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private leaderService: LeaderService
  ) {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment === 'client') {
        this.links = ['/entity', 'client'];
      } else {
        this.links = ['/entity', 'leader'];
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.entId = params['entreprise'];
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.leaderService.find(id).subscribe(leader => {
        if (leader.birthDate) {
          leader.birthDate = {
            year: leader.birthDate.getFullYear(),
            month: leader.birthDate.getMonth() + 1,
            day: leader.birthDate.getDate()
          };
        }
        if (leader.createdDate) {
          leader.createdDate = {
            year: leader.createdDate.getFullYear(),
            month: leader.createdDate.getMonth() + 1,
            day: leader.createdDate.getDate()
          };
        }
        if (leader.lastModifiedDate) {
          leader.lastModifiedDate = {
            year: leader.lastModifiedDate.getFullYear(),
            month: leader.lastModifiedDate.getMonth() + 1,
            day: leader.lastModifiedDate.getDate()
          };
        }
        this.leaderModalRef(component, leader);
      });
    } else {
      let leader = new Leader();
      if (this.entId != -1) leader.clientsId = this.entId;
      return this.leaderModalRef(component, leader);
    }
  }

  leaderModalRef(component: Component, leader: Leader): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.leader = leader;
    modalRef.result.then(
      result => {
        this.router.navigate([...this.links, { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      },
      reason => {
        this.router.navigate([...this.links, { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
