import { Injectable, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { GroupMember } from "./group-member.model";
import { GroupMemberService } from "./group-member.service";

@Injectable()
export class GroupMemberPopupService {
  grpeId: any;
  links: string[] = [];
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupMemberService: GroupMemberService
  ) {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment === "client") {
        this.links = ["/entity", "client"];
      } else {
        this.links = ["/entity", "group-member"];
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.grpeId = params["groupe"];
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.groupMemberService.find(id).subscribe(groupMember => {
        if (groupMember.createdDate) {
          groupMember.createdDate = {
            year: groupMember.createdDate.getFullYear(),
            month: groupMember.createdDate.getMonth() + 1,
            day: groupMember.createdDate.getDate()
          };
        }
        if (groupMember.lastModifiedDate) {
          groupMember.lastModifiedDate = {
            year: groupMember.lastModifiedDate.getFullYear(),
            month: groupMember.lastModifiedDate.getMonth() + 1,
            day: groupMember.lastModifiedDate.getDate()
          };
        }
        this.groupMemberModalRef(component, groupMember);
      });
    } else {
      return this.groupMemberModalRef(component, new GroupMember());
    }
  }

  groupMemberModalRef(
    component: Component,
    groupMember: GroupMember
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.groupMember = groupMember;
    let extras: any = {
      replaceUrl: true
    };
    if (this.grpeId) {
      extras = {
        queryParams: {
          type: "groupe",
          id: this.grpeId
        }
      };
    }
    modalRef.result.then(
      result => {
        this.router.navigate(
          [...this.links, { outlets: { popup: null } }],
          extras
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          [...this.links, { outlets: { popup: null } }],
          extras
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
