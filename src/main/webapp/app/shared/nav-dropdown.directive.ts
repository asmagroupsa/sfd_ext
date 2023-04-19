import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[jhiappNavDropdown]"
})
export class NavDropdownDirective {
  constructor(private el: ElementRef) {}

  toggle() {
    this.el.nativeElement.classList.toggle("open");
  }
}

/**
* Allows the dropdown to be toggled via click.
*/
@Directive({
  selector: "[jhiappNavDropdownToggle]"
})
export class NavDropdownToggleDirective {
  constructor(private dropdown: NavDropdownDirective) {}

  @HostListener("click", ["$event"])
  toggleOpen($event: any) {
    $event.preventDefault();
    this.dropdown.toggle();
  }
}

export const NAV_DROPDOWN_DIRECTIVES = [
  NavDropdownDirective,
  NavDropdownToggleDirective
];
