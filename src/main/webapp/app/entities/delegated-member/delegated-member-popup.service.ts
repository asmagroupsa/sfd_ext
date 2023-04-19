import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DelegatedMember } from './delegated-member.model';
import { DelegatedMemberService } from './delegated-member.service';

@Injectable()
export class DelegatedMemberPopupService {
  params: { [key: string]: any };
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private delegatedMemberService: DelegatedMemberService
  ) {
    this.ngbModalRef = null;
    activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen || !this.params['delegation']) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.delegatedMemberService.find(id).subscribe(delegatedMember => {
          if (delegatedMember.nominationDate) {
            delegatedMember.nominationDate = {
              year: delegatedMember.nominationDate.getFullYear(),
              month: delegatedMember.nominationDate.getMonth() + 1,
              day: delegatedMember.nominationDate.getDate()
            };
          }
          if (delegatedMember.endNominationDate) {
            delegatedMember.endNominationDate = {
              year: delegatedMember.endNominationDate.getFullYear(),
              month: delegatedMember.endNominationDate.getMonth() + 1,
              day: delegatedMember.endNominationDate.getDate()
            };
          }
          this.ngbModalRef = this.delegatedMemberModalRef(
            component,
            delegatedMember
          );
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        let delegatedMember = new DelegatedMember();
        delegatedMember.delegationComityId = +this.params['delegation'];
        setTimeout(() => {
          this.ngbModalRef = this.delegatedMemberModalRef(
            component,
            delegatedMember
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  delegatedMemberModalRef(
    component: Component,
    delegatedMember: DelegatedMember
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.delegatedMember = delegatedMember;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'delegation-comity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'delegation-comity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
