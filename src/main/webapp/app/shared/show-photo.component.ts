import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'jhi-show-photo',
    template: `
<div class="modal" *ngIf="show">
<input class="modal-state" id="modal-1" type="checkbox" checked="true"/>
  <label class="modal__bg" for="modal-1" style="display: none;"></label>
  <div class="modal__inner">
    <label class="modal__close" for="modal-1" (click)="close()"></label>
      <h4>{{title}}</h4>
    <p><img [src]="imgUrl" alt="" /></p>
  </div>
</div>
    `,
    styles: [
        `
         .modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: left;
  background: rgba(0,0,0, .9);
  transition: opacity .25s ease;
  width: 100%;
    height: 100%;
    min-height: 100% !important;
}
#modal-1{
    display:none;
    visibility:hiddent;
}
.modal__bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: pointer;
}

.modal-state:checked + .modal {
  opacity: 1;
  visibility: visible;
}

.modal-state:checked + .modal .modal__inner {
  top: 0;
}

.modal__inner {
  transition: top .25s ease;
  position: absolute;
  top: -20%;
  right: 0;
  bottom: 0;
  left: 0;
  width: 50%;
  margin: auto;
  overflow: auto;
  background: #fff;
  border-radius: 0px;
  padding: 1em 2em;
  height: 50%;
  box-shadow: 0 12px 28px rgba(0,0,0,0.30), 0 10px 8px rgba(0,0,0,0.12);
}

.modal__close {
  position: absolute;
  right: 1em;
  top: 1em;
  width: 1.1em;
  height: 1.1em;
  cursor: pointer;
}

.modal__close:after,
.modal__close:before {
  content: '';
  position: absolute;
  width: 2px;
  height: 1.5em;
  background: #ccc;
  display: block;
  transform: rotate(45deg);
  left: 50%;
  margin: -3px 0 0 -1px;
  top: 0;
}

.modal__close:hover:after,
.modal__close:hover:before {
  background: #aaa;
}

.modal__close:before {
  transform: rotate(-45deg);
}

@media screen and (max-width: 768px) {
	
  .modal__inner {
    width: 90%;
    height: 90%;
    box-sizing: border-box;
  }
}


/* Other
 * =============================== */
p img {
      height: 250px !important;
    width: 100% !important;
  float: left;
  margin: 0 1em 1em 0;
}
        `
    ]
})

export class ShowPhotoComponent {
    @Input() show: boolean;
    @Input() title: string;
    @Input() imgUrl: string = "https://i.imgur.com/HnrkBwB.gif";
    @Output() onClose = new EventEmitter<boolean>();
    close() {
        this.onClose.emit(true);
        this.show = false;
    }
}