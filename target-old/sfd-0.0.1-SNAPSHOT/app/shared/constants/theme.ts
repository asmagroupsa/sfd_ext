import { Injectable } from "@angular/core";

@Injectable()
export class ThemePalette {
  HEADER_BACK: string;
  HEADER_COLOR: string;
  SIDE_BACK: string;
  SIDE_COLOR: string;
  constructor() {
    this.HEADER_BACK = "rgb(96, 125, 139)";
    this.HEADER_COLOR = "white";
    this.SIDE_BACK = "#000";
    this.SIDE_COLOR = "#fff";
  }
  changeTheme(theme: number) {
    switch (theme) {
      case 0:
        this.HEADER_BACK = "rgb(96, 125, 139)";
        this.HEADER_COLOR = "white";
        this.SIDE_BACK = "#000";
        this.SIDE_COLOR = "#fff";
        break;
      case 1:
        this.HEADER_BACK = "#00bcd4;";
        this.HEADER_COLOR = "white";
        this.SIDE_BACK = "#00bcd4;";
        this.SIDE_COLOR = "#fff";
        break;
      case 2:
        this.HEADER_BACK = "#ff9800";
        this.HEADER_COLOR = "white";
        this.SIDE_BACK = "#cddc39";
        this.SIDE_COLOR = "#fff";
        break;
      case 3:
        this.HEADER_BACK = "#e91e63";
        this.HEADER_COLOR = "white";
        this.SIDE_BACK = "#e040fb";
        this.SIDE_COLOR = "#fff";
        break;
      case 4:
        this.HEADER_BACK = "#00bcd4";
        this.HEADER_COLOR = "white";
        this.SIDE_BACK = "#009688";
        this.SIDE_COLOR = "#fff";
        break;
      case 5:
        this.HEADER_BACK = "#9e9e9e";
        this.HEADER_COLOR = "white";
        this.SIDE_BACK = "#607d8b";
        this.SIDE_COLOR = "#fff";
        break;
      default:
        this.HEADER_BACK = "#fff";
        this.HEADER_COLOR = "rgba(0, 0, 0, 0.3);";
        this.SIDE_BACK = "#000";
        this.SIDE_COLOR = "#fff";
        break;
    }
  }
}
