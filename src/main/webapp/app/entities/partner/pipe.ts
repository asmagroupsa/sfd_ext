// import {Injectable, Pipe} from '@angular/core';
import { PipeTransform, Pipe } from '@angular/core';


@Pipe({ name: 'line' })
export class LinePipe implements PipeTransform {
  transform(lines, id: any) {
    return lines.filter(line => {
      return line.partnerId == id;
    });
  }
}
